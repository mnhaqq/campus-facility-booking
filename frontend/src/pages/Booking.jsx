import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import facilityService from '../services/facilityService'
import bookingService from '../services/bookingService'
import AvailabilityGrid from '../components/AvailabilityGrid'
import BookingForm from '../components/BookingForm'
import BookingCalendar from '../components/BookingCalendar'
import { SpinnerLoader } from '../components/Loader'

const page = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:    { opacity: 0,       transition: { duration: 0.2 } },
}

const today = new Date().toISOString().split('T')[0]

const ctrlStyle = {
  fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem',
  color: 'var(--text)', background: 'rgba(168,85,247,0.06)',
  border: '1px solid rgba(168,85,247,0.22)', outline: 'none',
  borderRadius: '0.75rem', padding: '0.75rem 1rem', width: '100%',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  appearance: 'none', WebkitAppearance: 'none',
}

export default function Booking() {
  const [searchParams] = useSearchParams()

  const [facilityId,   setFacilityId]   = useState(searchParams.get('facilityId') ?? '')
  const [date,         setDate]         = useState(today)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [refreshKey,   setRefreshKey]   = useState(0)

  useEffect(() => { setSelectedSlot(null) }, [facilityId, date])

  const { data: facilities, loading: fLoading, error: fError } =
    useFetch(() => facilityService.getAll(), [])

  const { data: allBookings, loading: bLoading, refetch: refetchBookings } =
    useFetch(() => bookingService.getAll(), [refreshKey])

  const dayBookings = useMemo(() => {
    if (!allBookings || !facilityId || !date) return []
    return allBookings.filter(
      b => String(b.facility_id) === String(facilityId) &&
           b.date === date &&
           b.status !== 'cancelled'
    )
  }, [allBookings, facilityId, date])

  const handleSuccess = () => {
    setRefreshKey(k => k + 1)
    setSelectedSlot(null)
  }

  const selectedFac = (facilities ?? []).find(f => String(f.id) === String(facilityId))

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" className="pt-24 pb-20">
      <div className="uv-section">

        {/* Page header */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: 'var(--c-section-lbl)' }}>
            Reservation
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Book a <span className="uv-gradient-text">Space</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
            Select a facility, pick a date, and click a{' '}
            <span style={{ color: '#34D399', fontWeight: 600 }}>green slot</span>{' '}
            to pre-fill your booking form.
          </p>
        </div>

        {/* Backend error */}
        {fError && (
          <div className="uv-glass mb-8 p-8 text-center" style={{ borderColor: 'rgba(248,113,113,0.25)' }}>
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#F87171' }}>Unable to load facilities</p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              Please check your connection or try again later. If the problem persists, contact the Facilities Office.
            </p>
          </div>
        )}

        {fLoading && (
          <div className="flex items-center gap-3 py-8" style={{ color: 'var(--text-muted)' }}>
            <SpinnerLoader size="sm" />
            <span className="text-sm">Loading facilities…</span>
          </div>
        )}

        {!fLoading && !fError && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Availability section (3/5) ── */}
            <div className="lg:col-span-3 space-y-5">

              {/* Facility selector */}
              <div className="uv-glass p-5">
                <label className="uv-label">Facility</label>
                <select value={facilityId} onChange={e => setFacilityId(e.target.value)} style={ctrlStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)'; e.target.style.boxShadow = 'none' }}
                >
                  <option value="" style={{ background: 'var(--c-dropdown-bg)', color: 'var(--text-muted)' }}>— Select a facility —</option>
                  {(facilities ?? []).map(f => (
                    <option key={f.id} value={f.id} style={{ background: 'var(--c-dropdown-bg)', color: 'var(--text)' }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calendar date picker */}
              <div className="uv-glass p-5">
                <p className="text-xs font-bold uppercase tracking-wider mb-4"
                   style={{ color: 'var(--c-section-lbl)' }}>
                  Select Date
                </p>
                <BookingCalendar
                  selectedDate={date}
                  onDateSelect={setDate}
                  bookings={allBookings ?? []}
                  facilityId={facilityId}
                />
              </div>

              {/* Facility banner */}
              {selectedFac && (
                <motion.div key={selectedFac.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                  style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
                >
                  <span className="text-2xl">🏛️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{selectedFac.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      {selectedFac.location} · Cap: {selectedFac.capacity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399' }}>
                    Available
                  </span>
                </motion.div>
              )}

              {/* Grid */}
              <div className="uv-glass p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                    Slots for{' '}
                    <span className="uv-gradient-text">
                      {date ? new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                        weekday: 'long', day: 'numeric', month: 'long',
                      }) : '—'}
                    </span>
                  </h2>
                  {bLoading && <SpinnerLoader size="sm" />}
                </div>
                <AvailabilityGrid
                  facilityId={facilityId}
                  date={date}
                  bookings={dayBookings}
                  loading={bLoading}
                  selectedSlot={selectedSlot}
                  onSlotSelect={setSelectedSlot}
                />
              </div>
            </div>

            {/* ── Booking form (2/5) ── */}
            <div className="lg:col-span-2">
              <div className="uv-glass p-6 sticky top-24"
                style={{ boxShadow: '0 0 40px rgba(168,85,247,0.1)' }}>
                <h2 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                  >📝</span>
                  Booking Details
                </h2>
                <BookingForm
                  facilities={facilities ?? []}
                  selectedFacilityId={facilityId}
                  setSelectedFacilityId={setFacilityId}
                  selectedDate={date}
                  setSelectedDate={setDate}
                  selectedSlot={selectedSlot}
                  onSuccess={handleSuccess}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
