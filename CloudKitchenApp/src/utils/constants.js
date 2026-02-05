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
import Constants from 'expo-constants';

/**
 * Automatically detect the correct API base URL using Expo's built-in IP detection
 * 
 * - Expo automatically detects your dev machine's IP address
 * - Works on physical devices, emulators, and simulators
 * - No manual IP configuration needed - updates automatically when you change networks
 * - Each team member gets their own machine's IP automatically
 */
const getDevApiUrl = () => {
  const PORT = '8000';

  // Expo automatically provides your dev machine's IP address
  // This is the same IP Expo uses to connect to Metro bundler
  const expoIP = Constants.expoConfig?.hostUri?.split(':')[0];

  if (expoIP) {
    console.log(`🌐 Using Expo detected IP: ${expoIP}`);
    return `http://${expoIP}:${PORT}`;
  }

  // Fallback for Android emulator
  if (Platform.OS === 'android') {
    console.log('📱 Using Android emulator IP: 10.0.2.2');
    return `http://10.0.2.2:${PORT}`;
  }

  // Fallback for iOS simulator
  console.log('📱 Using iOS simulator IP: localhost');
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
