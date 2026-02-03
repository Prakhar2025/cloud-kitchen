/**
 * ============================================================================
 * AsyncStorage Wrapper - Secure Token & User Storage
 * ============================================================================
 * 
 * Provides a clean API for storing and retrieving authentication tokens
 * and user data using React Native's AsyncStorage.
 * 
 * All methods include error handling and logging for debugging.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from './constants';

// Storage keys from constants
const TOKEN_KEY = APP_CONFIG.TOKEN_STORAGE_KEY;
const USER_KEY = APP_CONFIG.USER_STORAGE_KEY;

// =============================================================================
// Token Management
// =============================================================================

/**
 * Save authentication token to storage
 * @param {string} token - The Sanctum bearer token
 * @returns {Promise<boolean>} - Success status
 */
export const saveToken = async (token) => {
    try {
        if (!token) {
            console.warn('saveToken: Attempted to save empty token');
            return false;
        }
        await AsyncStorage.setItem(TOKEN_KEY, token);
        return true;
    } catch (error) {
        console.error('saveToken error:', error);
        return false;
    }
};

/**
 * Retrieve authentication token from storage
 * @returns {Promise<string|null>} - The stored token or null
 */
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('getToken error:', error);
        return null;
    }
};

/**
 * Remove authentication token from storage
 * @returns {Promise<boolean>} - Success status
 */
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        return true;
    } catch (error) {
        console.error('removeToken error:', error);
        return false;
    }
};

/**
 * Check if a token exists in storage
 * @returns {Promise<boolean>} - True if token exists
 */
export const hasToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return token !== null && token.length > 0;
    } catch (error) {
        console.error('hasToken error:', error);
        return false;
    }
};

// =============================================================================
// User Data Management
// =============================================================================

/**
 * Save user data to storage
 * @param {Object} user - User object from API
 * @returns {Promise<boolean>} - Success status
 */
export const saveUser = async (user) => {
    try {
        if (!user) {
            console.warn('saveUser: Attempted to save empty user');
            return false;
        }
        const userJson = JSON.stringify(user);
        await AsyncStorage.setItem(USER_KEY, userJson);
        return true;
    } catch (error) {
        console.error('saveUser error:', error);
        return false;
    }
};

/**
 * Retrieve user data from storage
 * @returns {Promise<Object|null>} - The stored user object or null
 */
export const getUser = async () => {
    try {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        if (!userJson) return null;
        return JSON.parse(userJson);
    } catch (error) {
        console.error('getUser error:', error);
        return null;
    }
};

/**
 * Remove user data from storage
 * @returns {Promise<boolean>} - Success status
 */
export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem(USER_KEY);
        return true;
    } catch (error) {
        console.error('removeUser error:', error);
        return false;
    }
};

// =============================================================================
// Combined Operations
// =============================================================================

/**
 * Save both token and user data (used after login/register)
 * @param {string} token - The bearer token
 * @param {Object} user - The user object
 * @returns {Promise<boolean>} - Success status
 */
export const saveAuthData = async (token, user) => {
    try {
        const tokenSaved = await saveToken(token);
        const userSaved = await saveUser(user);
        return tokenSaved && userSaved;
    } catch (error) {
        console.error('saveAuthData error:', error);
        return false;
    }
};

/**
 * Clear all authentication data (used on logout)
 * @returns {Promise<boolean>} - Success status
 */
export const clearAuthData = async () => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        return true;
    } catch (error) {
        console.error('clearAuthData error:', error);
        return false;
    }
};

/**
 * Get both token and user data
 * @returns {Promise<{token: string|null, user: Object|null}>}
 */
export const getAuthData = async () => {
    try {
        const [token, userJson] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
        return {
            token: token[1],
            user: userJson[1] ? JSON.parse(userJson[1]) : null,
        };
    } catch (error) {
        console.error('getAuthData error:', error);
        return { token: null, user: null };
    }
};

export default {
    saveToken,
    getToken,
    removeToken,
    hasToken,
    saveUser,
    getUser,
    removeUser,
    saveAuthData,
    clearAuthData,
    getAuthData,
};
