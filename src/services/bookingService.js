import api from '../config/axios';

/**
 * Booking Service - Handles all booking/reservation-related API calls
 */
export const bookingService = {
  /**
   * Get user reservations/bookings from server
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20)
   * @param {string} options.status - Filter by status (optional)
   * @returns {Promise<Object>} Response with reservations data and pagination
   */
  async getUserReservations(options = {}) {
    try {
      const { page = 1, limit = 20, status } = {
        page: Number(options.page),
        limit: Number(options.limit),
        status: options.status
      };
      
      // Build query parameters - ensure page and limit are always provided
      // Ensure page and limit are numbers before converting to strings
      const params = new URLSearchParams({
        page: Number(page).toString(),
        limit: Number(limit).toString()
      });
      
      // Only add status if it's provided
      if (status) {
        params.append('status', status);
      }
      
      console.log('Fetching user reservations from:', `/api/booking/reservations?${params}`);
      
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await api.get(`/api/booking/reservations?${params}`, { headers });
      console.log('User reservations response:', response.data);
      
      if (response.data && response.data.success) {
        return {
          data: response.data.data || [],
          pagination: response.data.pagination || {}
        };
      } else {
        console.warn('Server response was not successful:', response.data);
        return { data: [], pagination: {} };
      }
    } catch (error) {
      console.error('Error fetching user reservations from server:', error);
      
      // If the endpoint doesn't exist yet, return empty array
      if (error.response && error.response.status === 404) {
        console.warn('Reservations endpoint not found - returning empty array');
        return { data: [], pagination: {} };
      }
      
      throw error;
    }
  },

  /**
   * Create a new reservation
   * @param {Object} reservationData - Reservation data
   * @returns {Promise<Object>} Created reservation
   */
  async createReservation(reservationData) {
    try {
      const response = await api.post('/api/booking/reservations', reservationData);
      
      if (response.data.success) {
        return response.data.reservation;
      } else {
        throw new Error(response.data.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  /**
   * Cancel a reservation
   * @param {string} reservationId - Reservation ID to cancel
   * @returns {Promise<Object>} Updated reservation
   */
  async cancelReservation(reservationId) {
    try {
      const response = await api.patch(`/api/booking/reservations/${reservationId}/cancel`);
      
      if (response.data.success) {
        return response.data.reservation;
      } else {
        throw new Error(response.data.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  },

  /**
   * Get all reservations (admin)
   * @returns {Promise<Object>} Response with all reservations data
   */
  async getAllReservations() {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('/api/booking/reservations/all', { headers });
      if (response.data && response.data.success) {
        return {
          data: response.data.data || [],
          pagination: response.data.pagination || {}
        };
      } else {
        console.warn('Server response was not successful:', response.data);
        return { data: [], pagination: {} };
      }
    } catch (error) {
      console.error('Error fetching all reservations from server:', error);
      throw error;
    }
  }
};
