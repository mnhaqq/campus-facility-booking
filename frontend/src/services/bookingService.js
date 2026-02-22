/**
 * Booking Service — wraps all /bookings and /availability API calls.
 *
 * Endpoints consumed:
 *   GET    /api/bookings                 → getAll()
 *   POST   /api/bookings                 → create(data)
 *   PUT    /api/bookings/{id}            → update(id, data)
 *   DELETE /api/bookings/{id}            → remove(id)
 *   GET    /api/availability?...         → checkAvailability(params)
 *
 * POST /api/bookings body shape:
 *   { facility_id, user_id, date, start_time, end_time }
 *
 * GET /api/availability query params:
 *   facility_id, date, start_time, end_time
 */
import api from './api'

const bookingService = {
  /** Fetch all bookings (includes nested facility + user) */
  getAll: () => api.get('/bookings'),

  /**
   * Create a new booking.
   * @param {{ facility_id: number, user_id: number, date: string, start_time: string, end_time: string }} data
   */
  create: (data) => api.post('/bookings', data),

  /**
   * Update an existing booking (e.g., status change).
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => api.put(`/bookings/${id}`, data),

  /** Cancel / delete a booking */
  remove: (id) => api.delete(`/bookings/${id}`),

  /**
   * Check if a slot is available.
   * @param {{ facility_id: number, date: string, start_time: string, end_time: string }} params
   * @returns {Promise<{ available: boolean }>}
   */
  checkAvailability: (params) => api.get('/availability', { params }),
}

export default bookingService
