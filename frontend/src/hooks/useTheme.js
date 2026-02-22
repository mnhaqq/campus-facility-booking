import { useState, useEffect } from 'react'

/**
 * Theme hook — manages dark/light mode with localStorage persistence.
 * Applies 'dark' class to <html> element (Tailwind class strategy).
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') ?? 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const isDark = theme === 'dark'

  return { theme, isDark, toggleTheme }
}
