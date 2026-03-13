/**
 * ============================================================================
 * Authentication API Functions
 * ============================================================================
 * 
 * API functions for user authentication operations.
 * All functions use the centralized apiClient with interceptors.
 */

import apiClient, { getValidationErrors } from './client';
import { ENDPOINTS } from '../utils/constants';

// =============================================================================
// Login
// =============================================================================

/**
 * Authenticate user with email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, data?: Object, error?: string, errors?: Object}>}
 * 
 * @example
 * const result = await login('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('Token:', result.data.token);
 *   console.log('User:', result.data.user);
 * } else {
 *   console.log('Error:', result.error);
 * }
 */
export const login = async (email, password) => {
    try {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
            email: email.trim().toLowerCase(),
            password,
        });

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data,
            };
        }

        return {
            success: false,
            error: response.data.message || 'Login failed',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Login failed',
            errors: getValidationErrors(error),
        };
    }
};

// =============================================================================
// Register
// =============================================================================

/**
 * Register a new user account
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.password_confirmation - Password confirmation
 * @returns {Promise<{success: boolean, data?: Object, error?: string, errors?: Object}>}
 * 
 * @example
 * const result = await register({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   password_confirmation: 'SecurePass123'
 * });
 */
export const register = async (userData) => {
    try {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
            name: userData.name.trim(),
            email: userData.email.trim().toLowerCase(),
            phone: userData.phone?.trim(),
            role: userData.role,
            password: userData.password,
            password_confirmation: userData.password_confirmation,
        });

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data,
            };
        }

        return {
            success: false,
            error: response.data.message || 'Registration failed',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Registration failed',
            errors: getValidationErrors(error),
        };
    }
};

// =============================================================================
// Logout
// =============================================================================

/**
 * Logout current user (revoke current token)
 * 
 * @returns {Promise<{success: boolean, error?: string}>}
 * 
 * @example
 * const result = await logout();
 * if (result.success) {
 *   // Clear local state and navigate to login
 * }
 */
export const logout = async () => {
    try {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);

        return {
            success: response.data.success === true,
            error: response.data.success ? null : response.data.message,
        };
    } catch (error) {
        // Even if logout fails on server, we should allow local logout
        console.warn('Logout API failed:', error.message);
        return {
            success: true, // Allow local logout to proceed
            error: null,
        };
    }
};

// =============================================================================
// Logout All Devices
// =============================================================================

/**
 * Logout from all devices (revoke all tokens)
 * 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logoutAll = async () => {
    try {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGOUT_ALL);

        return {
            success: response.data.success === true,
            error: response.data.success ? null : response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to logout from all devices',
        };
    }
};

// =============================================================================
// Get User
// =============================================================================

/**
 * Get authenticated user's profile
 * 
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 * 
 * @example
 * const result = await getUser();
 * if (result.success) {
 *   console.log('User:', result.data.user);
 * }
 */
export const getUser = async () => {
    try {
        const response = await apiClient.get(ENDPOINTS.AUTH.USER);

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data,
            };
        }

        return {
            success: false,
            error: response.data.message || 'Failed to get user',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to get user',
        };
    }
};

// =============================================================================
// Forgot Password
// =============================================================================

/**
 * Send password reset link to email
 * 
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/forgot-password', {
            email: email.trim().toLowerCase(),
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to send reset link.',
            errors: error.response?.data?.errors || {},
        };
    }
};

// =============================================================================
// Health Check
// =============================================================================

/**
 * Check if the API is reachable
 * 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const checkHealth = async () => {
    try {
        const response = await apiClient.get('/health');
        return {
            success: response.data.status === 'ok',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export default {
    login,
    register,
    logout,
    logoutAll,
    getUser,
    forgotPassword,
    checkHealth,
};
