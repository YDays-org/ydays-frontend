import api from './api';

// Add a listing to favorites
export const addToFavorites = async (listingId) => {
  try {
    const response = await api.post(`/api/catalog/favorites/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw error;
  }
};

// Remove a listing from favorites
export const removeFromFavorites = async (listingId) => {
  try {
    const response = await api.delete(`/api/catalog/favorites/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from favorites error:', error);
    throw error;
  }
};

// Get user's favorite listings
export const getFavorites = async (params = {}) => {
  try {
    const { page = 1, limit = 20, type } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type })
    });

    const response = await api.get(`/api/catalog/favorites?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
};

// Check if a listing is in user's favorites
export const isFavorite = async (listingId) => {
  try {
    const response = await api.get(`/api/catalog/favorites/${listingId}/check`);
    return response.data;
  } catch (error) {
    console.error('Check favorite error:', error);
    throw error;
  }
};

// Toggle favorite status (add or remove)
export const toggleFavorite = async (listingId) => {
  try {
    // First check if it's already a favorite
    const checkResponse = await isFavorite(listingId);
    
    if (checkResponse.data.isFavorite) {
      // Remove from favorites
      return await removeFromFavorites(listingId);
    } else {
      // Add to favorites
      return await addToFavorites(listingId);
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  }
};

export default {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite,
  toggleFavorite
};
