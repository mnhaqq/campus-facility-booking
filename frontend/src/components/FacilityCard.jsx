import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const facilityIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('lab'))           return '🔬'
  if (n.includes('auditorium') || n.includes('hall')) return '🎭'
  if (n.includes('library'))       return '📚'
  if (n.includes('gym') || n.includes('sport')) return '⚽'
  if (n.includes('seminar') || n.includes('room')) return '🖥️'
  if (n.includes('cafe'))          return '☕'
  if (n.includes('garden') || n.includes('outdoor')) return '🌿'
  if (n.includes('studio'))        return '🎨'
  return '🏛️'
}

export default function FacilityCard({ facility, index = 0 }) {
  const navigate = useNavigate()
  const go = (e) => {
    e?.stopPropagation()
    navigate(`/booking?facilityId=${facility.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -7, transition: { duration: 0.2 } }}
      className="uv-glass flex flex-col h-full overflow-hidden cursor-pointer group"
      onClick={go}
    >
      {/* Top accent line — gradient */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, #7C3AED, #A855F7, #E879F9)',
        opacity: 0.8,
      }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))',
              border: '1px solid rgba(168,85,247,0.3)',
              boxShadow: '0 0 16px rgba(168,85,247,0.15)',
            }}
          >
            {facilityIcon(facility.name)}
          </div>

          {/* Available badge */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#34D399',
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-80 animate-ping-uv" />
              <span className="relative rounded-full bg-emerald-400 w-1.5 h-1.5" />
            </span>
            Available
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-lg font-bold mb-1.5 transition-all duration-200 group-hover:uv-gradient-text"
          style={{ color: 'var(--text)', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {facility.name}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {facility.location}
        </p>

        {/* Capacity */}
        <span
          className="inline-flex items-center self-start gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{
            background: 'rgba(129,140,248,0.1)',
            border: '1px solid rgba(129,140,248,0.25)',
            color: '#818CF8',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Capacity: {facility.capacity}
        </span>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-dim)' }}>
          Available for academic and extracurricular activities. Book in
          precise 30-minute slots to fit your schedule.
        </p>

        {/* CTA */}
        <button
          className="uv-btn w-full justify-center mt-auto"
          onClick={go}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Book This Space
        </button>
      </div>
    </motion.div>
  )
}
