import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY  = 'campusUser'
const STUDENTS_KEY = 'campusStudents' // registry: { [studentId]: { name, email, password } }

function loadStudents() {
  try { return JSON.parse(localStorage.getItem(STUDENTS_KEY) ?? '{}') } catch { return {} }
}

function saveStudents(map) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(map))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  /**
   * Register a new student.
   * Returns null on success, or an error string on failure.
   */
  const register = (studentId, name, email, password) => {
    const id = Number(studentId)
    const students = loadStudents()

    if (students[id]) {
      return 'A student with this ID is already registered. Please sign in instead.'
    }

    students[id] = { name: name.trim(), email: email.trim().toLowerCase(), password }
    saveStudents(students)

    // Auto-login after registration
    const u = { id, name: name.trim(), email: email.trim().toLowerCase() }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    localStorage.setItem('campusUserId', String(id))
    return null
  }

  /**
   * Sign in an existing student.
   * Returns null on success, or an error string on failure.
   */
  const login = (studentId, password) => {
    const id = Number(studentId)
    const students = loadStudents()
    const record = students[id]

    if (!record) {
      return 'No account found with this Student ID. Please register first.'
    }
    if (record.password !== password) {
      return 'Incorrect password. Please try again.'
    }

    const u = { id, name: record.name, email: record.email }
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    localStorage.setItem('campusUserId', String(id))
    return null
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('campusUserId')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
