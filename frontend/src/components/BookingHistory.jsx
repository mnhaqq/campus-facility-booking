import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import bookingService from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import StatusBadge from './StatusBadge'
import { SkeletonRow, SpinnerLoader } from './Loader'

function getUserBookingIds(userId) {
  try {
    return new Set(JSON.parse(localStorage.getItem(`campusBookings_${userId}`) ?? '[]'))
  } catch { return new Set() }
}

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'pending',   label: 'Pending'   },
  { key: 'cancelled', label: 'Cancelled' },
]

const fmtDate = d =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  }) : '—'

const fmtTime = t => t ? t.slice(0, 5) : '—'

function BookingRow({ b, onCancel, cancelling, onConfirm, confirming }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200"
      style={{
        background: 'var(--c-row-bg)',
        border: '1px solid var(--c-row-border)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(168,85,247,0.08)'
        e.currentTarget.style.borderColor = 'rgba(168,85,247,0.22)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--c-row-bg)'
        e.currentTarget.style.borderColor = 'var(--c-row-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.12))',
          border: '1px solid rgba(168,85,247,0.25)',
        }}
      >
        🏛️
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1.5">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
            {b.facility?.name ?? `Facility #${b.facility_id}`}
          </p>
          <StatusBadge status={b.status ?? 'confirmed'} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-dim)' }}>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {fmtDate(b.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
            </svg>
            {fmtTime(b.start_time)} – {fmtTime(b.end_time)}
          </span>
          {b.user && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {b.user.name}
            </span>
          )}
          {b.facility?.location && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              {b.facility.location}
            </span>
          )}
          <span style={{ color: 'var(--text-faint)' }}>#{b.id}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {/* Confirm — only for pending bookings */}
        {b.status === 'pending' && (
          <button
            onClick={() => onConfirm(b.id)}
            disabled={confirming === b.id || cancelling === b.id}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: confirming === b.id ? 'rgba(52,211,153,0.08)' : 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.35)',
              color: '#34D399',
              cursor: confirming === b.id ? 'wait' : 'pointer',
              opacity: cancelling === b.id ? 0.4 : 1,
            }}
          >
            {confirming === b.id ? (
              <><SpinnerLoader size="sm" /> Confirming</>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Confirm
              </>
            )}
          </button>
        )}

        {/* Cancel — hidden for already-cancelled bookings */}
        {b.status !== 'cancelled' && (
          <button
            onClick={() => onCancel(b.id)}
            disabled={cancelling === b.id || confirming === b.id}
            className="uv-btn-danger flex-shrink-0"
            style={{ opacity: confirming === b.id ? 0.4 : 1 }}
          >
            {cancelling === b.id ? (
              <><SpinnerLoader size="sm" /> Cancelling</>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Cancel
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function BookingHistory() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useFetch(() => bookingService.getAll())
  const [tab,         setTab]         = useState('all')
  const [cancelling,  setCancelling]  = useState(null)
  const [confirming,  setConfirming]  = useState(null)
  const [cancelError, setCancelError] = useState(null)
  const [search,      setSearch]      = useState('')

  const handleCancel = async id => {
    setCancelError(null)
    setCancelling(id)
    try {
      await bookingService.remove(id)
      await refetch()
    } catch (err) {
      setCancelError(err.userMessage ?? err.message ?? 'Could not cancel this booking.')
    } finally {
      setCancelling(null)
    }
  }

  const handleConfirm = async id => {
    setCancelError(null)
    setConfirming(id)
    try {
      await bookingService.update(id, { status: 'confirmed' })
      await refetch()
    } catch (err) {
      setCancelError(err.userMessage ?? err.message ?? 'Could not confirm this booking.')
    } finally {
      setConfirming(null)
    }
  }

  // Only show bookings that belong to the current user (tracked in localStorage)
  const all = useMemo(() => {
    const raw = data ?? []
    if (!user) return raw
    const ids = getUserBookingIds(user.id)
    if (ids.size === 0) return []
    return raw.filter(b => ids.has(b.id))
  }, [data, user])

  const filtered = all
    .filter(b => {
      if (tab !== 'all') {
        const s = (b.status ?? 'confirmed').toLowerCase()
        if (s !== tab) return false
      }
      if (search) {
        const q = search.toLowerCase()
        return (
          b.facility?.name?.toLowerCase().includes(q) ||
          b.date?.includes(q) ||
          String(b.id).includes(q) ||
          b.user?.name?.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const tabCount = key =>
    key === 'all' ? all.length : all.filter(b => (b.status ?? 'confirmed').toLowerCase() === key).length

  return (
    <div>
      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
               fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
               style={{ color: 'var(--text-dim)' }}>
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search facility, date, user…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              borderRadius: '0.75rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.875rem',
              color: 'var(--text)',
              background: 'rgba(168,85,247,0.06)',
              border: '1px solid rgba(168,85,247,0.2)',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.2)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <button onClick={refetch} className="uv-btn-ghost py-3 px-4 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(t => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                background: active ? 'rgba(168,85,247,0.15)' : 'transparent',
                border: active ? '1px solid rgba(168,85,247,0.38)' : '1px solid transparent',
                color: active ? '#C084FC' : 'var(--text-dim)',
                boxShadow: active ? '0 0 14px rgba(168,85,247,0.15)' : 'none',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.15)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'transparent' } }}
            >
              {t.label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  background: active ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.08)',
                  color: active ? '#C084FC' : 'var(--text-faint)',
                }}
              >
                {tabCount(t.key)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Cancel error */}
      <AnimatePresence>
        {cancelError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-3 p-3.5 rounded-xl text-sm"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.28)', color: '#F87171' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {cancelError}
            <button onClick={() => setCancelError(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}
        >
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#F87171' }}>Unable to load bookings</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
            Please check your connection or try again later.
          </p>
          <button onClick={refetch} className="uv-btn-ghost text-sm">Try Again</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-5xl mb-4 opacity-30">📭</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>No bookings found</p>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
            {search ? 'Try a different search.' : 'Create your first booking to see it here.'}
          </p>
        </motion.div>
      )}

      {/* List */}
      {!loading && !error && filtered.length > 0 && (
        <div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-faint)' }}>
            Showing <span style={{ color: 'var(--text-muted)' }}>{filtered.length}</span> booking{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map(b => (
                <BookingRow key={b.id} b={b} onCancel={handleCancel} cancelling={cancelling} onConfirm={handleConfirm} confirming={confirming} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
