import api from './api';

export const catalogService = {
  // Get listings with filters
  getListings: async (params = {}) => {
    try {
      const response = await api.get('/api/catalog/listings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  // Get listing by ID
  getListingById: async (id) => {
    try {
      const response = await api.get(`/api/catalog/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get('/api/catalog/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get amenities
  getAmenities: async () => {
    try {
      const response = await api.get('/api/catalog/amenities');
      return response.data;
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }
  },

  // Get new listings
  getNewListings: async (params = {}) => {
    try {
      const response = await api.get('/api/catalog/listings/new', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching new listings:', error);
      throw error;
    }
  },

  // Get trending listings
  getTrendingListings: async (params = {}) => {
    try {
      const response = await api.get('/api/catalog/listings/trending', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending listings:', error);
      throw error;
    }
  },

  // Get personalized feed (requires authentication)
  getPersonalizedFeed: async (params = {}) => {
    try {
      const response = await api.get('/api/catalog/feed', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized feed:', error);
      throw error;
    }
  },

  // Add to favorites (requires authentication)
  addFavorite: async (listingId) => {
    try {
      const response = await api.post(`/api/catalog/favorites/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites (requires authentication)
  removeFavorite: async (listingId) => {
    try {
      const response = await api.delete(`/api/catalog/favorites/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Get user's favorites (requires authentication)
  getFavorites: async (params = {}) => {
    try {
      const response = await api.get('/api/catalog/favorites', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  // Check if listing is in favorites (requires authentication)
  checkFavorite: async (listingId) => {
    try {
      const response = await api.get(`/api/catalog/favorites/${listingId}/check`);
      return response.data;
    } catch (error) {
      console.error('Error checking favorite:', error);
      throw error;
    }
  },
};

export default catalogService; 