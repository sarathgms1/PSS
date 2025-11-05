/**
 * API Configuration
 * Base URL for all API endpoints
 */

// For Android Emulator, use 10.0.2.2 instead of localhost
// For iOS Simulator, use localhost
// For physical devices, use your computer's IP address
const BASE_URL = 'http://10.0.2.2:9999';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/users',
  USERS: '/api/users',
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};

export default BASE_URL;

