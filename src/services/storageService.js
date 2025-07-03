/**
 * Storage Service - Handles localStorage operations
 */
export const storageService = {
  /**
   * Get the current authentication token from local storage
   * @returns {string|null} The auth token or null if not found
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  /**
   * Set the authentication token in local storage
   * @param {string} token - The token to store
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    }
  },

  /**
   * Get the current user from local storage
   * @returns {Object|null} The user object or null if not found
   */
  getAuthUser() {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Set the authenticated user data in local storage
   * @param {Object} user - The user object to store
   */
  setAuthUser(user) {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }));
    }
  },

  /**
   * Get the user profile from local storage
   * @returns {Object|null} The profile object or null if not found
   */
  getUserProfile() {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  },

  /**
   * Set the user profile in local storage
   * @param {Object} profile - The profile object to store
   */
  setUserProfile(profile) {
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  },

  /**
   * Clear all auth data from local storage
   */
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('userProfile');
  }
};
