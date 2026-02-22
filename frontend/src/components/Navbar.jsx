import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'Facilities',   to: '/facilities' },
  { label: 'Book Now',     to: '/booking' },
  { label: 'My Bookings',  to: '/history' },
  { label: 'Contact',      to: '/contact' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'var(--c-nav-bg)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderBottom: '1px solid var(--c-nav-border)',
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.08)',
      } : {
        background: 'transparent',
      }}
    >
      <nav className="uv-section flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={close}>
          <span className="text-xl group-hover:animate-float inline-block">🏛️</span>
          <span
            className="font-bold text-xl uv-gradient-text tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CampusBook
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className="block">
                {({ isActive }) => (
                  <span className="relative px-3.5 py-2 rounded-xl text-sm font-medium inline-flex items-center">
                    {isActive && (
                      <motion.span
                        layoutId="nav-uv-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'rgba(168, 85, 247, 0.12)',
                          border: '1px solid rgba(168, 85, 247, 0.25)',
                          boxShadow: '0 0 12px rgba(168, 85, 247, 0.15)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span
                      className="relative"
                      style={{ color: isActive ? '#C084FC' : 'var(--text-muted)', transition: 'color 0.15s ease' }}
                      onMouseEnter={e => { if (!isActive) e.target.style.color = '#D8B4FE' }}
                      onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--text-muted)' }}
                    >
                      {l.label}
                    </span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Auth — desktop */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              {/* User pill */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  color: '#C084FC',
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold max-w-[100px] truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="uv-btn-ghost py-2 px-4 text-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"    className="uv-btn-ghost py-2 px-4 text-sm">Sign In</Link>
              <Link to="/register" className="uv-btn py-2 px-5 text-sm">Register</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(p => !p)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl transition-all"
            style={{ background: open ? 'rgba(168,85,247,0.1)' : 'transparent' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-5 h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--text-muted)' }}
                animate={
                  i === 0 ? { rotate: open ? 45 : 0, y: open ? 8 : 0 }
                  : i === 1 ? { opacity: open ? 0 : 1 }
                  : { rotate: open ? -45 : 0, y: open ? -8 : 0 }
                }
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit=  {{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{
              background: 'var(--c-nav-bg)',
              backdropFilter: 'blur(22px)',
              borderBottom: '1px solid var(--c-nav-border)',
              overflow: 'hidden',
            }}
          >
            <ul className="flex flex-col py-3 uv-section">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={close}
                    className="block"
                  >
                    {({ isActive }) => (
                      <span
                        className="block px-4 py-3 text-sm font-medium rounded-xl mx-1 my-0.5 transition-all"
                        style={{
                          color: isActive ? '#C084FC' : 'var(--text-muted)',
                          background: isActive ? 'rgba(168,85,247,0.1)' : 'transparent',
                          border: isActive ? '1px solid rgba(168,85,247,0.2)' : '1px solid transparent',
                        }}
                      >
                        {l.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}

              {/* Mobile auth links */}
              {isLoggedIn ? (
                <>
                  <li className="px-1 pt-3 pb-1">
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-2 text-sm"
                      style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-semibold" style={{ color: '#C084FC' }}>{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="uv-btn-ghost w-full justify-center">
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li className="px-1 pt-3 pb-1 flex flex-col gap-2">
                  <Link to="/login"    onClick={close} className="uv-btn-ghost w-full justify-center">Sign In</Link>
                  <Link to="/register" onClick={close} className="uv-btn w-full justify-center">Register</Link>
                </li>
              )}

              <li className="px-1 pt-2 pb-1">
                <Link to="/booking" onClick={close} className="uv-btn w-full justify-center">
                  Reserve a Space
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
