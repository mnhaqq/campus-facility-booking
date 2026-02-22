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

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [name,      setName]      = useState('')
  const [studentId, setStudentId] = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState(null)

  const handleSubmit = e => {
    e.preventDefault()
    setError(null)

    const trimName  = name.trim()
    const trimEmail = email.trim()
    const numId     = Number(studentId)

    if (!trimName)  { setError('Please enter your full name.'); return }
    if (!studentId || isNaN(numId) || numId < 1) {
      setError('Please enter a valid numeric Student ID.'); return
    }
    if (!trimEmail || !trimEmail.includes('@')) {
      setError('Please enter a valid student email address.'); return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return
    }
    if (password !== confirmPw) {
      setError('Passwords do not match.'); return
    }

    const err = register(numId, trimName, trimEmail, password)
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
              Create an <span className="uv-gradient-text">Account</span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Set up your student booking profile.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="uv-glass p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="uv-label">Full Name</label>
                <input
                  type="text" value={name} required
                  placeholder="e.g. Kwame Asante"
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle)}
                />
              </div>

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

              {/* Email */}
              <div>
                <label className="uv-label">Student Email</label>
                <input
                  type="email" value={email} required
                  placeholder="e.g. kwame.asante@campus.edu.gh"
                  onChange={e => setEmail(e.target.value)}
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
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="uv-label">Confirm Password</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirmPw} required
                  placeholder="Re-enter password"
                  onChange={e => setConfirmPw(e.target.value)}
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle)}
                />
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
                Create Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
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
              Already have an account?{' '}
              <Link to="/login"
                className="font-semibold transition-colors"
                style={{ color: '#C084FC' }}
                onMouseEnter={e => e.target.style.color = '#D8B4FE'}
                onMouseLeave={e => e.target.style.color = '#C084FC'}
              >
                Sign in
              </Link>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-xs mt-6"
            style={{ color: 'var(--text-faint)' }}
          >
            Session stored locally in your browser · Demo app
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
