/**
 * Facility Service — wraps all /facilities API calls.
 *
 * Endpoints consumed:
 *   GET  /api/facilities        → index()
 *   GET  /api/facilities/{id}   → show(id)
 */
import api from './api'

const facilityService = {
  /** Fetch all facilities */
  getAll: () => api.get('/facilities'),

  /** Fetch a single facility by ID */
  getById: (id) => api.get(`/facilities/${id}`),
}

export default facilityService
