import api from '../config/axios';

/**
 * Profile Service - Handles all profile-related API calls
 */
export const profileService = {
  /**
   * Get user profile from server
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    try {
      console.log('Fetching user profile from:', '/api/auth/profile');
      const response = await api.get('/api/auth/profile');
      console.log('User profile response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data.user;
      } else {
        console.warn('Server response was not successful:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile from server:', error);
      
      // Check if it's an HTML response (which indicates wrong endpoint)
      if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<!doctype html>')) {
        console.error('❌ Received HTML instead of JSON - API server may not be running on correct port');
        console.error('Expected API server on: http://localhost:4000');
        console.error('Make sure the server is running with: npm run dev');
      }
      
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} uid - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateUserProfile(uid, profileData) {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      
      if (response.data.success) {
        return response.data.user;
      } else {
        throw new Error(response.data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating user profile on server:', error);
      throw error;
    }
  }
};
