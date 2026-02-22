import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export default function NotFound() {
  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit"
      className="min-h-[85vh] flex items-center justify-center pt-20">
      <div className="uv-section text-center py-20">

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center justify-center w-36 h-36 rounded-full mx-auto text-6xl animate-float"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.12), rgba(168,85,247,0.03))',
              border: '2px solid rgba(168,85,247,0.25)',
              boxShadow: '0 0 50px rgba(168,85,247,0.15)',
            }}
          >
            🏛️
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-8xl sm:text-9xl font-bold uv-gradient-text mb-4 leading-none"
        >
          404
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}
        >
          Space Not Found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mb-10 max-w-sm mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}
        >
          This page doesn't exist in our universe. Let's warp you back to
          familiar space.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/" className="uv-btn px-8 py-3">← Back to Home</Link>
          <Link to="/facilities" className="uv-btn-ghost px-8 py-3">Browse Facilities</Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
