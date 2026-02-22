import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

const PREVIEW_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
const todayStr = new Date().toISOString().split('T')[0]

const SLOT_CFG = {
  available: { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)',  color: '#34D399' },
  booked:    { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#F87171' },
}

const STATIC_SLOTS = [
  { t: '09:00', s: 'booked'    },
  { t: '09:30', s: 'available' },
  { t: '10:00', s: 'available' },
  { t: '10:30', s: 'booked'    },
  { t: '11:00', s: 'available' },
  { t: '11:30', s: 'available' },
]

export default function Hero({ facilityCount = 0, bookingCount = 0, facilities = [], bookings = [] }) {
  const [cardIdx, setCardIdx] = useState(0)

  useEffect(() => {
    if (facilities.length < 2) return
    const id = setInterval(() => setCardIdx(i => i + 1), 3500)
    return () => clearInterval(id)
  }, [facilities.length])

  const activeFac = facilities.length ? facilities[cardIdx % facilities.length] : null

  const bookedSet = new Set(
    bookings
      .filter(b => activeFac && String(b.facility_id) === String(activeFac.id) && b.date === todayStr)
      .map(b => b.start_time?.slice(0, 5))
  )

  const slotData = activeFac
    ? PREVIEW_TIMES.map(t => ({ t, s: bookedSet.has(t) ? 'booked' : 'available' }))
    : STATIC_SLOTS

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% -5%, #251643 0%, var(--void) 65%)',
      }} />
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Glowing orbs — purely decorative, behind everything */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-20 animate-float-slow"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(232,121,249,0.5), transparent 70%)', filter: 'blur(50px)', animationDelay: '3s' }} />
        <div className="absolute bottom-[-5%] left-[10%] w-[350px] h-[350px] rounded-full opacity-10 animate-float-slow"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.5), transparent 70%)', filter: 'blur(55px)', animationDelay: '1.5s' }} />
      </div>

      {/* ── MAIN CONTENT — 2-column grid on lg. No absolute cards. ── */}
      <div className="uv-section relative z-10 w-full py-28 pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text ── */}
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Tag */}
            <motion.div variants={item} className="mb-7">
              <span className="uv-chip">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-uv-500 opacity-75 animate-ping-uv" />
                  <span className="relative rounded-full bg-uv-500 w-2 h-2" />
                </span>
                Live Availability · Real-Time
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] mb-6"
            >
              Reserve Any<br />
              <span className="uv-gradient-text">Campus Space</span><br />
              In Seconds.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={item}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              Browse lecture halls, labs, and sports venues. Check real-time
              30-minute slot availability and confirm your booking instantly —
              no paperwork, no waiting.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-14">
              <Link to="/booking" className="uv-btn px-8 py-4 text-base">
                Book a Space
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/facilities" className="uv-btn-ghost px-8 py-4 text-base">
                Browse Facilities
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="flex flex-wrap gap-10">
              {[
                { v: facilityCount || '—', l: 'Facilities' },
                { v: bookingCount  || '—', l: 'Bookings'   },
                { v: '30 min',             l: 'Precision'  },
                { v: '8am–8pm',            l: 'Daily Hours' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-bold uv-gradient-text leading-none">{s.v}</div>
                  <div className="text-xs mt-1.5" style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Floating availability card (no overlap possible) ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex justify-center items-center"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="uv-glass p-7 w-80"
              style={{ boxShadow: '0 0 50px rgba(168, 85, 247, 0.2), 0 0 0 1px rgba(168,85,247,0.1) inset' }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}
                >
                  📅
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Today's Slots</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFac?.id ?? 'static'}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
                        {activeFac ? activeFac.name : 'Main Auditorium'}
                      </p>
                      {activeFac?.location && (
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-faint)' }}>
                          {activeFac.location}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Slot grid preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFac?.id ?? 'static'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-3 gap-2 mb-5"
                >
                  {slotData.map(({ t, s }) => {
                    const cfg = SLOT_CFG[s]
                    return (
                      <div
                        key={t}
                        className="text-center py-2 rounded-xl text-xs font-bold"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                      >
                        {t}
                      </div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Facility dots */}
              {facilities.length > 1 && (
                <div className="flex justify-center gap-1.5 mb-4">
                  {facilities.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width:  i === cardIdx % facilities.length ? '16px' : '6px',
                        height: '6px',
                        background: i === cardIdx % facilities.length
                          ? '#A855F7'
                          : 'rgba(168,85,247,0.25)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Live indicator */}
              <div
                className="flex items-center gap-2.5 text-xs pt-4"
                style={{ borderTop: '1px solid rgba(168,85,247,0.15)', color: '#34D399' }}
              >
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-ping-uv" />
                  <span className="relative rounded-full bg-emerald-400 w-2 h-2" />
                </span>
                <span className="font-semibold">Live — updates in real time</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: 'rgba(168,85,247,0.3)' }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: '#A855F7' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
