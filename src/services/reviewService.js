import api from './api';

export const reviewService = {
  /**
   * Submit a review for a booking
   * @param {Object} reviewData - Review data
   * @param {string} reviewData.bookingId - Booking ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Comment text
   * @returns {Promise<Object>} Review response
   */
  async submitReview(reviewData) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre un avis');
      }

      const response = await api.post('/api/reviews', reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de la soumission de l\'avis');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a listing
   * @param {string} listingId - Listing ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Reviews response
   */
  async getReviewsForListing(listingId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const params = new URLSearchParams({
        listingId,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get(`/api/reviews?${params}`);
      
      if (response.data.success) {
        return {
          data: response.data.data || [],
          pagination: response.data.pagination || {}
        };
      } else {
        console.warn('Server response was not successful:', response.data);
        return { data: [], pagination: {} };
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      
      // If the endpoint doesn't exist yet, return empty array
      if (error.response && error.response.status === 404) {
        console.warn('Reviews endpoint not found - returning empty array');
        return { data: [], pagination: {} };
      }
      
      throw error;
    }
  }
};

export default reviewService;
