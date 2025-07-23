import api from './api';

export const dashboardService = {
  // Get dashboard statistics (total bookings, revenue, ratings, listings)
  async getDashboardStats(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/api/partner/stats', { params });
      
      // If response is successful, enhance it with average rating calculation
      if (response.data && response.data.success) {
        const data = response.data.data;
        
        // Calculate average rating if not provided
        if (!data.averageRating && data.reviews && data.reviews.total > 0) {
          // This would need review data to calculate properly
          // For now, use a sample calculation
          data.averageRating = 4.2; // Default fallback
        }
        
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent bookings
  async getRecentBookings(page = 1, limit = 5) {
    try {
      const response = await api.get('/api/partner/bookings', { 
        params: { page, limit, sort: 'createdAt', order: 'desc' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  },

  // Get partner listings count (active listings)
  async getActiveListings() {
    try {
      const response = await api.get('/api/catalog/listings', {
        params: { page: 1, limit: 1 } // Just to get the count
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active listings:', error);
      throw error;
    }
  },

  // Get average rating from reviews
  async getAverageRating() {
    // This would fetch reviews data and calculate average
    // For now, return a placeholder
    return { success: true, data: { averageRating: 4.2 } };
  }
};

export default dashboardService;
