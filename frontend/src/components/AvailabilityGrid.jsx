import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SlotGridSkeleton } from './Loader'

/* ── 25 thirty-minute slots: 08:00 → 20:00 (last slot starts at 20:00) ── */
function generateSlots() {
  const slots = []
  for (let h = 8; h <= 20; h++) {
    const hh  = String(h).padStart(2, '0')
    const hh1 = String(h + 1).padStart(2, '0')
    const ampm = h < 12 ? 'AM' : 'PM'
    const h12  = h > 12 ? h - 12 : h
    slots.push({ id: `${hh}:00`, start: `${hh}:00:00`, end: `${hh}:30:00`, label: `${h12}:00`, sub: ampm })
    if (h < 20) {
      slots.push({ id: `${hh}:30`, start: `${hh}:30:00`, end: `${hh1}:00:00`, label: `${h12}:30`, sub: ampm })
    }
  }
  return slots
}

function isSlotBooked(slot, bookings) {
  return bookings.some(b => b.start_time < slot.end && b.end_time > slot.start)
}

function isSlotPast(slot, date) {
  const today = new Date().toISOString().split('T')[0]
  if (date !== today) return false
  const now = new Date()
  const [h, m] = slot.start.split(':').map(Number)
  return h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())
}

const ALL_SLOTS = generateSlots()

const SLOT_STYLES = {
  available: {
    bg:     'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.28)',
    color:  '#34D399',
    hover:  { background: 'rgba(52,211,153,0.18)', boxShadow: '0 0 14px rgba(52,211,153,0.25)' },
    cursor: 'pointer',
  },
  booked: {
    bg:     'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.22)',
    color:  '#F87171',
    hover:  {},
    cursor: 'not-allowed',
  },
  selected: {
    bg:     'rgba(168, 85, 247, 0.22)',
    border: 'rgba(192, 132, 252, 0.7)',
    color:  '#C084FC',
    hover:  { boxShadow: '0 0 20px rgba(168,85,247,0.5)' },
    cursor: 'pointer',
  },
  past: {
    bg:     'rgba(107, 94, 138, 0.05)',
    border: 'rgba(107, 94, 138, 0.12)',
    color:  '#42355E',
    hover:  {},
    cursor: 'not-allowed',
  },
}

export default function AvailabilityGrid({ facilityId, date, bookings = [], loading, selectedSlot, onSlotSelect }) {
  const slots = useMemo(() => ALL_SLOTS.map(slot => {
    const past   = isSlotPast(slot, date)
    const booked = isSlotBooked(slot, bookings)
    const sel    = selectedSlot?.id === slot.id
    let status = 'available'
    if (past)                status = 'past'
    if (booked)              status = 'booked'
    if (sel && !booked && !past) status = 'selected'
    return { ...slot, status }
  }), [bookings, date, selectedSlot])

  if (!facilityId) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="text-4xl mb-3 opacity-40">📅</div>
        <p className="text-sm font-medium" style={{ color: '#6B5E8A' }}>
          Select a facility and date to view slots.
        </p>
      </div>
    )
  }
  if (loading) return <SlotGridSkeleton />

  const availCount = slots.filter(s => s.status === 'available').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-4 flex-wrap text-xs">
          {[
            { label: 'Available', bg: 'rgba(52,211,153,0.1)',  b: 'rgba(52,211,153,0.3)',  c: '#34D399' },
            { label: 'Booked',    bg: 'rgba(248,113,113,0.1)', b: 'rgba(248,113,113,0.3)', c: '#F87171' },
            { label: 'Selected',  bg: 'rgba(168,85,247,0.2)',  b: 'rgba(192,132,252,0.6)', c: '#C084FC' },
            { label: 'Past',      bg: 'rgba(107,94,138,0.05)', b: 'rgba(107,94,138,0.15)', c: '#42355E' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-sm" style={{ background: l.bg, border: `1px solid ${l.b}` }} />
              <span style={{ color: l.c }}>{l.label}</span>
            </span>
          ))}
        </div>
        <div className="text-xs font-semibold" style={{ color: '#6B5E8A' }}>
          <span style={{ color: '#34D399' }}>{availCount}</span> free ·{' '}
          <span style={{ color: '#F87171' }}>{bookedCount}</span> booked
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
        {slots.map((slot, i) => {
          const st  = SLOT_STYLES[slot.status]
          const can = slot.status === 'available' || slot.status === 'selected'
          return (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.012, duration: 0.28, ease: 'easeOut' }}
              disabled={slot.status === 'booked' || slot.status === 'past'}
              onClick={() => can && onSlotSelect(slot)}
              className="relative flex flex-col items-center justify-center h-14 rounded-xl text-xs font-bold select-none transition-all duration-150"
              style={{
                background: st.bg,
                border: `1px solid ${st.border}`,
                color: st.color,
                cursor: st.cursor,
                boxShadow: slot.status === 'selected' ? '0 0 18px rgba(168,85,247,0.4)' : 'none',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={e => { if (can && Object.keys(st.hover).length) Object.assign(e.currentTarget.style, st.hover) }}
              onMouseLeave={e => {
                e.currentTarget.style.background = st.bg
                e.currentTarget.style.boxShadow = slot.status === 'selected' ? '0 0 18px rgba(168,85,247,0.4)' : 'none'
              }}
              title={
                slot.status === 'booked'   ? 'Already booked'
                : slot.status === 'past'   ? 'Slot has passed'
                : slot.status === 'selected' ? 'Selected — fill form below'
                : 'Click to select'
              }
            >
              <span className="font-bold text-[11px] leading-none">{slot.label}</span>
              <span className="text-[9px] mt-0.5 opacity-60">{slot.sub}</span>
              {slot.status === 'selected' && (
                <svg className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              )}
              {slot.status === 'booked' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-30">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected slot confirmation */}
      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium"
          style={{
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#C084FC',
            boxShadow: '0 0 16px rgba(168,85,247,0.1)',
          }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          <span>
            <strong>{selectedSlot.label} {selectedSlot.sub}</strong>{' '}
            ({selectedSlot.start.slice(0,5)} – {selectedSlot.end.slice(0,5)})
            {' '}— fill the form to confirm.
          </span>
          <button
            onClick={() => onSlotSelect(null)}
            className="ml-auto text-xs opacity-60 hover:opacity-100 transition-opacity"
            title="Clear selection"
          >✕</button>
        </motion.div>
      )}
    </div>
  )
}
