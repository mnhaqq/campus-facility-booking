import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BookingHistory from '../components/BookingHistory'

const page = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:    { opacity: 0,       transition: { duration: 0.2 } },
}

export default function History() {
  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" className="pt-24 pb-20">
      <div className="uv-section">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: 'var(--c-section-lbl)' }}>
              Your Reservations
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-4xl sm:text-5xl font-bold">
              Booking <span className="uv-gradient-text">History</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              View, track, and manage all campus reservations. Cancel bookings no longer needed.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <Link to="/booking" className="uv-btn">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              New Booking
            </Link>
          </motion.div>
        </div>

        {/* Status guide */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="uv-glass p-4 mb-8 flex flex-wrap gap-5 items-center">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>Status:</span>
          {[
            { s: 'confirmed', note: 'Active reservation',   bg: 'rgba(52,211,153,0.1)',  b: 'rgba(52,211,153,0.3)',  c: '#34D399' },
            { s: 'pending',   note: 'Awaiting review',      bg: 'rgba(252,211,77,0.1)',  b: 'rgba(252,211,77,0.3)',  c: '#FCD34D' },
            { s: 'rejected',  note: 'Declined',             bg: 'rgba(248,113,113,0.1)', b: 'rgba(248,113,113,0.3)', c: '#F87171' },
            { s: 'cancelled', note: 'Manually cancelled',   bg: 'rgba(129,140,248,0.1)', b: 'rgba(129,140,248,0.25)',c: '#818CF8' },
          ].map(({ s, note, bg, b, c }) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-semibold capitalize"
                style={{ background: bg, border: `1px solid ${b}`, color: c }}>
                {s}
              </span>
              <span style={{ color: 'var(--text-faint)' }}>{note}</span>
            </div>
          ))}
        </motion.div>

        {/* History component */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <BookingHistory />
        </motion.div>
      </div>
    </motion.div>
  )
}
