/**
 * ============================================================================
 * API Client - Axios Instance with Interceptors
 * ============================================================================
 * 
 * Centralized API client for all HTTP requests.
 * Handles authentication tokens, error responses, and network issues.
 * 
 * Features:
 * - Automatic token injection in headers
 * - Request/response logging in development
 * - Global error handling
 * - Network timeout handling
 */

import axios from 'axios';
import { API_URL, APP_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { getToken, clearAuthData } from '../utils/storage';

// =============================================================================
// Create Axios Instance
// =============================================================================

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: APP_CONFIG.REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// =============================================================================
// Request Interceptor
// =============================================================================

/**
 * Intercept outgoing requests to:
 * 1. Add authentication token if available
 * 2. Log requests in development
 */
apiClient.interceptors.request.use(
    async (config) => {
        // Get token from storage
        const token = await getToken();

        // Add token to headers if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Development logging
        if (__DEV__) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
            if (config.data) {
                // Don't log passwords
                const sanitizedData = { ...config.data };
                if (sanitizedData.password) sanitizedData.password = '***';
                if (sanitizedData.password_confirmation) sanitizedData.password_confirmation = '***';
                console.log('📦 Request Data:', sanitizedData);
            }
        }

        return config;
    },
    (error) => {
        if (__DEV__) {
            console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// =============================================================================
// Response Interceptor
// =============================================================================

/**
 * Intercept incoming responses to:
 * 1. Handle successful responses
 * 2. Handle authentication errors (401)
 * 3. Handle validation errors (422)
 * 4. Handle server errors (500)
 * 5. Handle network errors
 */
apiClient.interceptors.response.use(
    (response) => {
        // Development logging
        if (__DEV__) {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }

        // Return the response data directly
        return response;
    },
    async (error) => {
        // Development logging
        if (__DEV__) {
            console.error('❌ API Error:', error.response?.status, error.message);
            if (error.response?.data) {
                console.error('📦 Error Data:', error.response.data);
            }
        }

        // Handle different error types
        if (error.response) {
            const { status, data } = error.response;

            // 401 Unauthorized - Token expired or invalid
            if (status === 401) {
                // Clear stored auth data
                await clearAuthData();

                // The error will be handled by the component/context
                // which should redirect to login
                return Promise.reject({
                    status,
                    message: ERROR_MESSAGES.UNAUTHORIZED,
                    data,
                });
            }

            // 422 Validation Error
            if (status === 422) {
                return Promise.reject({
                    status,
                    message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
                    errors: data.errors || {},
                    data,
                });
            }

            // 500 Server Error
            if (status >= 500) {
                return Promise.reject({
                    status,
                    message: ERROR_MESSAGES.SERVER_ERROR,
                    data,
                });
            }

            // Other errors (400, 403, 404, etc.)
            return Promise.reject({
                status,
                message: data.message || ERROR_MESSAGES.UNKNOWN_ERROR,
                data,
            });
        }

        // Network error (no response)
        if (error.request) {
            return Promise.reject({
                status: 0,
                message: ERROR_MESSAGES.NETWORK_ERROR,
                isNetworkError: true,
            });
        }

        // Request setup error
        return Promise.reject({
            status: 0,
            message: ERROR_MESSAGES.UNKNOWN_ERROR,
        });
    }
);

// =============================================================================
// Helper Methods
// =============================================================================

/**
 * Check if error is a network error
 * @param {Object} error - Error object from API call
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
    return error.isNetworkError === true || error.status === 0;
};

/**
 * Check if error is an authentication error
 * @param {Object} error - Error object from API call
 * @returns {boolean}
 */
export const isAuthError = (error) => {
    return error.status === 401;
};

/**
 * Check if error is a validation error
 * @param {Object} error - Error object from API call
 * @returns {boolean}
 */
export const isValidationError = (error) => {
    return error.status === 422;
};

/**
 * Get validation errors as a flat object
 * @param {Object} error - Error object from API call
 * @returns {Object} - Field names with their first error message
 */
export const getValidationErrors = (error) => {
    if (!isValidationError(error) || !error.errors) {
        return {};
    }

    const flatErrors = {};
    Object.keys(error.errors).forEach((field) => {
        flatErrors[field] = Array.isArray(error.errors[field])
            ? error.errors[field][0]
            : error.errors[field];
    });
    return flatErrors;
};

export default apiClient;
