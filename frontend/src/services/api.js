/**
 * Centralized Axios instance — "Ultraviolet Nebula" Frontend
 *
 * Dev:  VITE_API_URL=/api  →  Vite proxy → http://localhost:8000/api  (no CORS)
 * Prod: VITE_API_URL=https://your-backend.com/api
 *
 * Laravel 12 api.php routes are automatically prefixed with /api via withRouting().
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15_000,
})

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data   = error.response?.data

    let userMessage

    if (!error.response) {
      // Network error — backend unreachable
      userMessage = 'Unable to connect. Please check your connection and try again.'
    } else if (status === 422) {
      // Validation errors from Laravel
      const errors = data?.errors
      if (errors) {
        userMessage = Object.values(errors).flat().join('  •  ')
      } else {
        userMessage = data?.message ?? 'Validation failed. Please check your inputs.'
      }
    } else if (status === 409) {
      userMessage = 'This time slot is already booked. Please choose another.'
    } else if (status === 404) {
      userMessage = 'The requested resource was not found.'
    } else if (status === 500) {
      userMessage = 'Something went wrong on our end. Please try again later.'
    } else {
      userMessage = 'An unexpected error occurred. Please try again.'
    }

    // ── Critical fix: create a proper Error instance ──
    // Spreading an AxiosError loses class properties.
    // We create a plain Error and attach userMessage as a property.
    const enhancedError      = new Error(userMessage)
    enhancedError.userMessage = userMessage
    enhancedError.status      = status
    enhancedError.data        = data
    enhancedError.original    = error

    return Promise.reject(enhancedError)
  },
)

export default api
