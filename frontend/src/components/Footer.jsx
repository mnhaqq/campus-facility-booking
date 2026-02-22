import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'Facilities',  to: '/facilities' },
  { label: 'Book Now',    to: '/booking' },
  { label: 'My Bookings', to: '/history' },
  { label: 'Contact',     to: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--c-footer-bg)',
      borderTop: '1px solid rgba(168,85,247,0.12)',
      position: 'relative',
      marginTop: 'auto',
      transition: 'background 0.3s ease',
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(232,121,249,0.3), transparent)',
      }} />

      <div className="uv-section py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold uv-gradient-text tracking-tight">CampusBook</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-dim)' }}>
              The modern way to reserve campus facilities. Built for students
              and designed for the future.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {LINKS.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--text-dim)' }}
                    onMouseEnter={e => e.target.style.color = '#C084FC'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(168,85,247,0.1)', color: 'var(--text-faint)' }}
        >
          <span>© {new Date().getFullYear()} CampusBook · Academic demonstration</span>
          <span style={{ color: 'var(--text-faint)' }}>Reserve any campus space in seconds.</span>
        </div>
      </div>
    </footer>
  )
}
