import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import bookingService from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { SpinnerLoader } from './Loader'

/* ─── Success Modal ─── */
function SuccessModal({ booking, facilityName, onClose, onHistory, pending = false }) {
  const accent = pending
    ? { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)', border: 'rgba(252,211,77,0.4)', glow: 'rgba(252,211,77,0.2)' }
    : { color: '#34D399', bg: 'rgba(52,211,153,0.2)',  border: 'rgba(52,211,153,0.5)', glow: 'rgba(52,211,153,0.2)' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--c-overlay)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 32 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit=  {{ opacity: 0, scale: 0.9,   y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="uv-glass p-8 max-w-sm w-full text-center"
        style={{ boxShadow: '0 0 60px rgba(168,85,247,0.3), 0 0 0 1px rgba(168,85,247,0.15)' }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 280 }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${accent.bg}, transparent)`,
            border: `2px solid ${accent.border}`,
            boxShadow: `0 0 30px ${accent.glow}`,
          }}
        >
          {pending ? (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={accent.color} strokeWidth="2.5">
              <motion.path strokeLinecap="round" strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.35, duration: 0.55 }} />
            </svg>
          ) : (
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={accent.color} strokeWidth="2.5">
              <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.35, duration: 0.55 }} />
            </svg>
          )}
        </motion.div>

        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {pending ? 'Booking Saved!' : 'Booking Confirmed!'}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {pending
            ? 'Your slot is held. Go to My Bookings to confirm or cancel it anytime.'
            : 'Your reservation has been successfully created.'}
        </p>

        {/* Details */}
        <div
          className="rounded-2xl p-4 mb-6 text-left space-y-2.5"
          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)' }}
        >
          {[
            { l: 'Booking ID', v: `#${booking?.id ?? '—'}` },
            { l: 'Facility',   v: facilityName || '—'      },
            { l: 'Date',       v: booking?.date ?? '—'     },
            { l: 'Time',       v: booking ? `${booking.start_time?.slice(0,5)} – ${booking.end_time?.slice(0,5)}` : '—' },
            { l: 'Status',     v: booking?.status ?? 'confirmed' },
          ].map(row => (
            <div key={row.l} className="flex justify-between text-sm">
              <span style={{ color: 'var(--text-dim)' }}>{row.l}</span>
              <span className="font-semibold" style={{ color: '#D8B4FE', textTransform: 'capitalize' }}>{row.v}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onHistory} className="uv-btn-ghost flex-1">
            {pending ? 'Go to My Bookings' : 'View History'}
          </button>
          <button onClick={onClose} className="uv-btn flex-1">
            {pending ? 'Book Another' : 'Book Another'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main BookingForm ─── */
export default function BookingForm({
  facilities = [],
  selectedFacilityId,
  setSelectedFacilityId,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  onSuccess,
}) {
  const navigate     = useNavigate()
  const { user }     = useAuth()

  // Pre-fill user ID from auth context; fall back to localStorage value
  const [userId,    setUserId]    = useState(() => {
    if (user?.id) return String(user.id)
    return localStorage.getItem('campusUserId') ?? '1'
  })
  const [submitting, setSubmitting] = useState(null) // null | 'confirmed' | 'pending'
  const [error,      setError]      = useState(null)
  const [showModal,  setShowModal]  = useState(false)
  const [created,    setCreated]    = useState(null)

  // Keep userId in sync when auth context changes
  useEffect(() => {
    if (user?.id) setUserId(String(user.id))
  }, [user])

  useEffect(() => {
    if (userId) localStorage.setItem('campusUserId', userId)
  }, [userId])

  const today  = new Date().toISOString().split('T')[0]
  const maxDay = new Date(Date.now() + 30 * 86400_000).toISOString().split('T')[0]
  const facName = (facilities.find(f => String(f.id) === String(selectedFacilityId)))?.name ?? ''

  const doSubmit = async (status) => {
    setError(null)

    if (!selectedFacilityId) { setError('Please select a facility.'); return }
    if (!selectedDate)        { setError('Please choose a date.'); return }
    if (!selectedSlot)        { setError('Please click a time slot in the availability grid above.'); return }
    if (!userId || isNaN(Number(userId))) { setError('Please enter a valid Student ID.'); return }

    setSubmitting(status)
    try {
      const res = await bookingService.create({
        facility_id: Number(selectedFacilityId),
        user_id:     Number(userId),
        date:        selectedDate,
        start_time:  selectedSlot.start,
        end_time:    selectedSlot.end,
        status,
      })
      setCreated(res.data)

      // Track this booking ID under the current user so My Bookings filters correctly
      const storageKey = `campusBookings_${user?.id ?? 'guest'}`
      try {
        const existing = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
        existing.push(res.data.id)
        localStorage.setItem(storageKey, JSON.stringify(existing))
      } catch { /* ignore storage errors */ }

      setShowModal(true)
      onSuccess?.()
    } catch (err) {
      setError(err.userMessage ?? err.message ?? 'Failed to create booking.')
    } finally {
      setSubmitting(null)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.875rem',
    color: 'var(--text)',
    background: 'rgba(168, 85, 247, 0.06)',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    appearance: 'none',
    WebkitAppearance: 'none',
  }
  const inputFocus = {
    borderColor: 'rgba(168, 85, 247, 0.65)',
    boxShadow: '0 0 0 3px rgba(168,85,247,0.12)',
  }

  return (
    <>
      <form onSubmit={e => e.preventDefault()} className="space-y-5">

        {/* Facility */}
        <div>
          <label className="uv-label">Facility *</label>
          <select
            value={selectedFacilityId ?? ''}
            onChange={e => setSelectedFacilityId(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, inputFocus)}
            onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)'; e.target.style.boxShadow = 'none' }}
          >
            <option value="" style={{ background: 'var(--c-dropdown-bg)', color: 'var(--text-muted)' }}>— Select a facility —</option>
            {facilities.map(f => (
              <option key={f.id} value={f.id} style={{ background: 'var(--c-dropdown-bg)', color: 'var(--text)' }}>
                {f.name}  (Cap: {f.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="uv-label">Date *</label>
          <input
            type="date" value={selectedDate} min={today} max={maxDay} required
            onChange={e => setSelectedDate(e.target.value)}
            style={inputStyle}
            onFocus={e => Object.assign(e.target.style, inputFocus)}
            onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Selected slot — read only display */}
        <div>
          <label className="uv-label">Selected Time Slot *</label>
          <div
            className="w-full px-4 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: selectedSlot ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.04)',
              border: `1px solid ${selectedSlot ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.12)'}`,
              color: selectedSlot ? '#C084FC' : 'var(--text-faint)',
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: selectedSlot ? '0 0 14px rgba(168,85,247,0.12)' : 'none',
            }}
          >
            {selectedSlot
              ? `${selectedSlot.label} ${selectedSlot.sub}  (${selectedSlot.start.slice(0,5)} – ${selectedSlot.end.slice(0,5)})`
              : 'Click a green slot in the grid above ↑'}
          </div>
        </div>

        {/* Booked by */}
        <div>
          <label className="uv-label">Booked By *</label>
          {user ? (
            <div
              className="w-full px-4 py-3 rounded-xl text-sm flex items-center gap-3"
              style={{
                background: 'rgba(168,85,247,0.07)',
                border: '1px solid rgba(168,85,247,0.2)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span className="text-base">👤</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }}>
                Signed in
              </span>
            </div>
          ) : (
            <>
              <input
                type="number" min="1" value={userId} required placeholder="Enter your Student ID"
                onChange={e => setUserId(e.target.value)}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocus)}
                onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)'; e.target.style.boxShadow = 'none' }}
              />
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>
                <a href="/login" style={{ color: '#C084FC' }}>Sign in</a> or{' '}
                <a href="/register" style={{ color: '#C084FC' }}>register</a> to auto-fill this field.
              </p>
            </>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#F87171',
                boxShadow: '0 0 16px rgba(248,113,113,0.1)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto opacity-60 hover:opacity-100 transition-opacity text-xs flex-shrink-0"
              >✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {/* Save for Later */}
          <button
            type="button"
            onClick={() => doSubmit('pending')}
            disabled={!!submitting || !selectedSlot}
            className="uv-btn-ghost flex-1 justify-center py-3.5"
            style={(!selectedSlot || !!submitting) ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          >
            {submitting === 'pending' ? (
              <><SpinnerLoader size="sm" /> Saving…</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                Save for Later
              </>
            )}
          </button>

          {/* Confirm Booking */}
          <button
            type="button"
            onClick={() => doSubmit('confirmed')}
            disabled={!!submitting || !selectedSlot}
            className="uv-btn flex-1 justify-center py-3.5"
            style={(!selectedSlot || !!submitting) ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          >
            {submitting === 'confirmed' ? (
              <><SpinnerLoader size="sm" /> Confirming…</>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Confirm
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success modal */}
      <AnimatePresence>
        {showModal && (
          <SuccessModal
            booking={created}
            facilityName={facName}
            pending={created?.status === 'pending'}
            onClose={() => { setShowModal(false); setCreated(null) }}
            onHistory={() => navigate('/history')}
          />
        )}
      </AnimatePresence>
    </>
  )
}
