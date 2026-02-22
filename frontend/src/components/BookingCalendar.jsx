import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const TOTAL_SLOTS = 25  // 08:00 – 20:00, last slot starts at 20:00

function toStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const DOT = {
  free:    { bg: '#34D399', label: 'Open'     },
  partial: { bg: '#FCD34D', label: 'Filling'  },
  low:     { bg: '#F97316', label: 'Few left' },
  full:    { bg: '#F87171', label: 'Full'     },
  none:    { bg: 'transparent', label: ''     },
}

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  bookings = [],
  facilityId,
}) {
  const now = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const todayStr = toStr(now.getFullYear(), now.getMonth(), now.getDate())
  const maxDate  = useMemo(() => new Date(now.getTime() + 30 * 86400_000), [now])

  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  /* Count booked slots per date for the selected facility */
  const bookedMap = useMemo(() => {
    if (!facilityId) return {}
    const map = {}
    bookings
      .filter(b => String(b.facility_id) === String(facilityId) && b.status !== 'cancelled')
      .forEach(b => { map[b.date] = (map[b.date] ?? 0) + 1 })
    return map
  }, [bookings, facilityId])

  /* Build calendar cells */
  const cells = useMemo(() => {
    const firstDow    = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const out = []
    for (let i = 0; i < firstDow; i++) out.push(null)       // padding
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr    = toStr(year, month, d)
      const dateObj    = new Date(year, month, d)
      const isPast     = dateObj < now
      const isFuture   = dateObj > maxDate
      const isDisabled = isPast || isFuture
      const isToday    = dateStr === todayStr
      const isSelected = dateStr === selectedDate
      const booked     = bookedMap[dateStr] ?? 0

      let dot = 'none'
      if (facilityId && !isDisabled) {
        if      (booked >= TOTAL_SLOTS)              dot = 'full'
        else if (booked >= Math.floor(TOTAL_SLOTS * 0.75)) dot = 'low'
        else if (booked > 0)                         dot = 'partial'
        else                                         dot = 'free'
      }

      out.push({ d, dateStr, isDisabled, isToday, isSelected, booked, dot })
    }
    return out
  }, [year, month, bookedMap, selectedDate, facilityId, now, maxDate, todayStr])

  /* Month navigation guards */
  const canPrev = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth())
  const canNext = year < maxDate.getFullYear() || (year === maxDate.getFullYear() && month < maxDate.getMonth())

  const prevMonth = () => {
    if (!canPrev) return
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (!canNext) return
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  return (
    <div>
      {/* ── Month navigator ── */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={canPrev ? { scale: 1.1 } : {}}
          whileTap={canPrev ? { scale: 0.9 } : {}}
          onClick={prevMonth}
          disabled={!canPrev}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all"
          style={{
            background:   canPrev ? 'rgba(168,85,247,0.12)' : 'transparent',
            border:       canPrev ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
            color:        canPrev ? '#C084FC' : 'var(--text-faint)',
            cursor:       canPrev ? 'pointer' : 'default',
          }}
        >‹</motion.button>

        <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
          {MONTHS[month]} {year}
        </span>

        <motion.button
          whileHover={canNext ? { scale: 1.1 } : {}}
          whileTap={canNext ? { scale: 0.9 } : {}}
          onClick={nextMonth}
          disabled={!canNext}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all"
          style={{
            background:   canNext ? 'rgba(168,85,247,0.12)' : 'transparent',
            border:       canNext ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
            color:        canNext ? '#C084FC' : 'var(--text-faint)',
            cursor:       canNext ? 'pointer' : 'default',
          }}
        >›</motion.button>
      </div>

      {/* ── Day-of-week headers ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold py-1"
               style={{ color: 'var(--text-faint)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Day cells ── */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} />

          return (
            <motion.button
              key={cell.dateStr}
              whileHover={!cell.isDisabled ? { scale: 1.12 } : {}}
              whileTap={!cell.isDisabled ? { scale: 0.92 } : {}}
              disabled={cell.isDisabled}
              onClick={() => !cell.isDisabled && onDateSelect(cell.dateStr)}
              className="relative flex flex-col items-center justify-center h-10 rounded-xl text-xs font-semibold transition-all duration-150"
              style={{
                background: cell.isSelected
                  ? 'rgba(168,85,247,0.28)'
                  : cell.isToday
                  ? 'rgba(168,85,247,0.09)'
                  : 'transparent',
                border: cell.isSelected
                  ? '1px solid rgba(168,85,247,0.65)'
                  : cell.isToday
                  ? '1px solid rgba(168,85,247,0.3)'
                  : '1px solid transparent',
                color: cell.isDisabled
                  ? 'var(--text-faint)'
                  : cell.isSelected
                  ? '#C084FC'
                  : 'var(--text)',
                cursor:    cell.isDisabled ? 'default' : 'pointer',
                opacity:   cell.isDisabled ? 0.28 : 1,
                boxShadow: cell.isSelected ? '0 0 14px rgba(168,85,247,0.3)' : 'none',
              }}
            >
              <span className="leading-none">{cell.d}</span>

              {/* Availability dot */}
              {!cell.isDisabled && facilityId && (
                <span
                  className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: DOT[cell.dot].bg }}
                />
              )}

              {/* "Today" ring */}
              {cell.isToday && !cell.isSelected && (
                <span
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: '0 0 8px rgba(168,85,247,0.25) inset' }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* ── Legend ── */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}>
        {facilityId ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-faint)' }}>Slots:</span>
            {(['free','partial','low','full']).map(k => (
              <span key={k} className="flex items-center gap-1.5 text-xs"
                    style={{ color: 'var(--text-dim)' }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: DOT[k].bg }} />
                {DOT[k].label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center" style={{ color: 'var(--text-faint)' }}>
            Select a facility above to see day-by-day availability
          </p>
        )}
      </div>
    </div>
  )
}
