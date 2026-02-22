import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className="w-4 h-4">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
      style={{
        background: 'rgba(168, 85, 247, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.22)',
        color: '#9580C1',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.16)'
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.45)'
        e.currentTarget.style.color = '#C084FC'
        e.currentTarget.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.25)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.22)'
        e.currentTarget.style.color = '#9580C1'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.span key="sun"
            initial={{ opacity: 0, rotate: -80, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit=   {{ opacity: 0, rotate:  80, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <SunIcon />
          </motion.span>
        ) : (
          <motion.span key="moon"
            initial={{ opacity: 0, rotate:  80, scale: 0.5 }}
            animate={{ opacity: 1, rotate:  0,  scale: 1   }}
            exit=   {{ opacity: 0, rotate: -80, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
