/**
 * ============================================================================
 * Application Constants
 * ============================================================================
 * 
 * Centralized configuration for the Cloud Kitchen mobile application.
 * These constants are used throughout the app for API calls, styling,
 * and general app configuration.
 * 
 * IMPORTANT: Update API_BASE_URL before production deployment!
 */

// =============================================================================
// API Configuration
// =============================================================================

import { Platform } from 'react-native';

/**
 * Automatically detect the correct API base URL based on platform and device type
 * 
 * - Android Emulator: Uses 10.0.2.2 (Android's special alias for host machine's localhost)
 * - iOS Simulator: Uses localhost/127.0.0.1
 * - Physical Device: Set PHYSICAL_DEVICE_IP environment variable or manually configure
 * 
 * To use with physical device, create a .env file in project root:
 * PHYSICAL_DEVICE_IP=192.168.1.100
 */
const getDevApiUrl = () => {
  const PORT = '8000';

  // For physical device testing, you can manually set your IP here
  // or use an environment variable
  const PHYSICAL_DEVICE_IP = null; // e.g., '192.168.1.100'

  // If physical device IP is configured, use it
  if (PHYSICAL_DEVICE_IP) {
    return `http://${PHYSICAL_DEVICE_IP}:${PORT}`;
  }

  // Android emulator needs special IP to access host machine
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}`;
  }

  // iOS simulator and default
  return `http://127.0.0.1:${PORT}`;
};

/**
 * Base URL for the Laravel API
 * Automatically configured for development, manually set for production
 */
export const API_BASE_URL = __DEV__
  ? getDevApiUrl()
  : 'https://your-production-api.com';

/**
 * API Version prefix
 * All API endpoints use this version prefix
 */
export const API_VERSION = 'v1';

/**
 * Full API URL with version
 * Example: http://10.0.2.2:8000/api/v1
 */
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

/**
 * Image base URL for food items, categories, etc.
 * Used for displaying images from the Laravel storage
 */
export const IMAGE_BASE_URL = `${API_BASE_URL}/storage`;

// =============================================================================
// API Endpoints
// =============================================================================

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    LOGOUT_ALL: '/logout-all',
    USER: '/user',
  },

  // Health check
  HEALTH: '/health',

  // Future endpoints (to be implemented)
  // MENU: {
  //   CATEGORIES: '/categories',
  //   FOOD_ITEMS: '/food-items',
  // },
  // CART: {
  //   INDEX: '/cart',
  //   ADD: '/cart/add',
  //   REMOVE: '/cart/remove',
  // },
  // ORDERS: {
  //   INDEX: '/orders',
  //   PLACE: '/orders/place',
  // },
};

// =============================================================================
// App Configuration
// =============================================================================

export const APP_CONFIG = {
  // App name displayed in headers, etc.
  APP_NAME: 'Cloud Kitchen',

  // App tagline for login/splash screens
  APP_TAGLINE: 'Delicious food, delivered fast',

  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000, // 30 seconds

  // Token storage key
  TOKEN_STORAGE_KEY: '@CloudKitchen:token',

  // User storage key
  USER_STORAGE_KEY: '@CloudKitchen:user',

  // Minimum password length for registration
  MIN_PASSWORD_LENGTH: 8,

  // Maximum name length
  MAX_NAME_LENGTH: 255,
};

// =============================================================================
// Validation Regex Patterns
// =============================================================================

export const REGEX = {
  // Email validation pattern
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Password must contain: 8+ chars, uppercase, lowercase, number
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  // Basic phone number validation
  PHONE: /^\+?[\d\s-]{10,}$/,
};

// =============================================================================
// Error Messages
// =============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

export default {
  API_BASE_URL,
  API_VERSION,
  API_URL,
  IMAGE_BASE_URL,
  ENDPOINTS,
  APP_CONFIG,
  REGEX,
  ERROR_MESSAGES,
};
