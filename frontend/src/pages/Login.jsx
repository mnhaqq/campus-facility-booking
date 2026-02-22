import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const page = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:    { opacity: 0,       transition: { duration: 0.2 } },
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
}
const focusStyle = { borderColor: 'rgba(168,85,247,0.65)', boxShadow: '0 0 0 3px rgba(168,85,247,0.12)' }
const blurStyle  = { borderColor: 'rgba(168,85,247,0.22)', boxShadow: 'none' }

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [studentId, setStudentId] = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState(null)

  const handleSubmit = e => {
    e.preventDefault()
    setError(null)

    if (!studentId || isNaN(Number(studentId)) || Number(studentId) < 1) {
      setError('Please enter a valid numeric Student ID.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    const err = login(studentId, password)
    if (err) { setError(err); return }
    navigate('/')
  }

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit"
      className="min-h-[85vh] flex items-center justify-center pt-20 pb-16">
      <div className="uv-section w-full">
        <div className="max-w-md mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="text-4xl mb-4 block">🏛️</span>
            <h1 className="text-3xl font-bold mb-2">
              Welcome <span className="uv-gradient-text">Back</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Sign in to manage your campus reservations.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="uv-glass p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Student ID */}
              <div>
                <label className="uv-label">Student ID</label>
                <input
                  type="number" min="1" value={studentId} required
                  placeholder="e.g. 10987654"
                  onChange={e => setStudentId(e.target.value)}
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="uv-label">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password} required
                    placeholder="Enter your password"
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                    onFocus={e => Object.assign(e.target.style, { ...focusStyle, paddingRight: '3rem' })}
                    onBlur={e => Object.assign(e.target.style, { ...blurStyle, paddingRight: '3rem' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                    tabIndex={-1}
                  >
                    {showPwd ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl text-sm"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </motion.div>
              )}

              <button type="submit" className="uv-btn w-full justify-center py-3.5">
                Sign In
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 uv-divider" />
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>or</span>
              <div className="flex-1 uv-divider" />
            </div>

            <p className="text-sm text-center" style={{ color: 'var(--text-dim)' }}>
              Don't have an account?{' '}
              <Link to="/register"
                className="font-semibold transition-colors"
                style={{ color: '#C084FC' }}
                onMouseEnter={e => e.target.style.color = '#D8B4FE'}
                onMouseLeave={e => e.target.style.color = '#C084FC'}
              >
                Register here
              </Link>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-xs mt-6 leading-relaxed"
            style={{ color: 'var(--text-faint)' }}
          >
            Session stored locally in your browser · Demo app
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
