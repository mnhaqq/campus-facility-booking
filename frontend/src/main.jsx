import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import './styles/animations.css'

// Apply persisted theme before first paint
const theme = localStorage.getItem('theme') ?? 'dark'
document.documentElement.classList.toggle('dark', theme === 'dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
