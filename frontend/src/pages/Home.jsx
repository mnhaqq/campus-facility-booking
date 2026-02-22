import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import Hero from '../components/Hero'
import FacilityCard from '../components/FacilityCard'
import facilityService from '../services/facilityService'
import bookingService from '../services/bookingService'
import { FacilityGridSkeleton } from '../components/Loader'

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

const FEATURES = [
  { icon: '⚡', title: 'Real-Time Slots',       desc: '30-minute precision with instant conflict detection. No double-bookings.',         color: '#A855F7' },
  { icon: '📅', title: 'Instant Confirmation',  desc: 'Submit and receive a booking ID immediately — no admin approval delays.',         color: '#E879F9' },
  { icon: '📋', title: 'Full History',           desc: 'Every reservation visible in your dashboard with status, time, and facility.',    color: '#818CF8' },
  { icon: '🔒', title: 'Conflict Prevention',   desc: 'Backend overlap detection ensures your slot is exclusively reserved for you.',    color: '#34D399' },
]

function SectionLabel({ children }) {
  return (
    <span
      className="text-xs font-bold uppercase tracking-widest mb-3 block"
      style={{ color: 'var(--c-section-lbl)' }}
    >
      {children}
    </span>
  )
}

export default function Home() {
  const { data: facilities, loading: fLoading } = useFetch(() => facilityService.getAll())
  const { data: bookings }                      = useFetch(() => bookingService.getAll())

  const preview = (facilities ?? []).slice(0, 3)

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit">
      <Hero
        facilityCount={facilities?.length ?? 0}
        bookingCount={bookings?.length ?? 0}
        facilities={facilities ?? []}
        bookings={bookings ?? []}
      />

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="uv-section relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <SectionLabel>Why CampusBook</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Book smarter,{' '}
              <span className="uv-gradient-text">not harder.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.09, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="uv-glass p-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: `rgba(${f.color === '#A855F7' ? '168,85,247' : f.color === '#E879F9' ? '232,121,249' : f.color === '#818CF8' ? '129,140,248' : '52,211,153'},0.12)`,
                    border: `1px solid ${f.color}35`,
                    boxShadow: `0 0 16px ${f.color}20`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility preview */}
      <section className="py-20">
        <div className="uv-section">
          <div className="flex items-center justify-between mb-10">
            <div>
              <SectionLabel>Available Now</SectionLabel>
              <h2 className="text-3xl font-bold">Featured Spaces</h2>
            </div>
            <Link to="/facilities" className="uv-btn-ghost text-sm py-2.5 px-5">View All →</Link>
          </div>

          {fLoading ? (
            <FacilityGridSkeleton count={3} />
          ) : preview.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {preview.map((f, i) => <FacilityCard key={f.id} facility={f} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-3 opacity-30">🏗️</div>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                No facilities yet. Start the Laravel server and run your seeders.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="uv-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uv-glass p-12 text-center relative overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(168,85,247,0.12)' }}
          >
            {/* BG glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-40 blur-3xl pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(232,121,249,0.1))' }}
            />
            <div className="relative">
              <span className="uv-chip mb-6 inline-flex">🏛️ Ready to book?</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Make your{' '}
                <span className="uv-gradient-text">reservation now.</span>
              </h2>
              <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Pick a facility, select your 30-minute slot, and confirm — all in under 60 seconds.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/booking"   className="uv-btn px-10 py-4 text-base">Book Now</Link>
                <Link to="/history"   className="uv-btn-ghost px-10 py-4 text-base">My Bookings</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
