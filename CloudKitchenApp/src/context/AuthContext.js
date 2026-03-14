/**
 * ============================================================================
 * Authentication Context
 * ============================================================================
 * 
 * Global authentication state management using React Context.
 * Provides user state, authentication status, and auth methods
 * to all components in the app.
 * 
 * Usage:
 * 1. Wrap your app with <AuthProvider>
 * 2. Use the useAuth() hook in any component
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';
import { saveAuthData, clearAuthData, getAuthData } from '../utils/storage';

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// Provider Component
// =============================================================================

/**
 * AuthProvider component that wraps the app and provides auth state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const AuthProvider = ({ children }) => {
    // State
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    // ==========================================================================
    // Initialize - Load saved auth data on app start
    // ==========================================================================

    useEffect(() => {
        loadStoredAuth();
    }, []);

    /**
     * Load stored authentication data from AsyncStorage
     */
    const loadStoredAuth = async () => {
        try {
            setIsLoading(true);
            const { token: storedToken, user: storedUser } = await getAuthData();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);

                // Optionally verify token is still valid
                try {
                    const result = await authApi.getUser();
                    if (result.success) {
                        setUser(result.data.user);
                    } else {
                        // Token invalid — drop to guest mode (stay in app)
                        await handleLogout();
                    }
                } catch (error) {
                    console.warn('Token verification failed:', error);
                }
            } else {
                // No stored token — open as guest (Swiggy-style: show menu immediately)
                setIsGuest(true);
            }
        } catch (error) {
            console.error('Failed to load stored auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================================================
    // Login
    // ==========================================================================

    /**
     * Login user with email and password
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{success: boolean, error?: string, errors?: Object}>}
     */
    const login = useCallback(async (email, password) => {
        try {
            const result = await authApi.login(email, password);

            if (result.success) {
                const { token: newToken, user: newUser } = result.data;

                // Update state
                setToken(newToken);
                setUser(newUser);
                setIsAuthenticated(true);
                setIsGuest(false); // Clear guest mode on login

                // Save to storage
                await saveAuthData(newToken, newUser);

                return { success: true };
            }

            return {
                success: false,
                error: result.error,
                errors: result.errors,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login failed',
            };
        }
    }, []);

    // ==========================================================================
    // Register
    // ==========================================================================

    /**
     * Register a new user
     * 
     * @param {Object} userData - { name, email, password, password_confirmation }
     * @returns {Promise<{success: boolean, error?: string, errors?: Object}>}
     */
    const register = useCallback(async (userData) => {
        try {
            const result = await authApi.register(userData);

            if (result.success) {
                const { token: newToken, user: newUser } = result.data;

                // Update state
                setToken(newToken);
                setUser(newUser);
                setIsAuthenticated(true);

                // Save to storage
                await saveAuthData(newToken, newUser);

                return { success: true };
            }

            return {
                success: false,
                error: result.error,
                errors: result.errors,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed',
            };
        }
    }, []);

    // ==========================================================================
    // Logout
    // ==========================================================================

    /**
     * Logout current user
     * 
     * @returns {Promise<void>}
     */
    const logout = useCallback(async () => {
        try {
            // Call API to revoke token
            await authApi.logout();
        } catch (error) {
            console.warn('Logout API failed:', error);
        } finally {
            // Always clear local state
            await handleLogout();
        }
    }, []);

    /**
     * Internal function to clear auth state
     */
    const handleLogout = async () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsGuest(true); // Stay in app as guest after logout (Swiggy-style)
        await clearAuthData();
    };

    // ==========================================================================
    // Guest Mode
    // ==========================================================================

    /** Allow user to browse without logging in */
    const continueAsGuest = useCallback(() => {
        setIsGuest(true);
    }, []);

    /** Exit guest mode — goes back to login screen */
    const exitGuest = useCallback(() => {
        setIsGuest(false);
    }, []);

    // ==========================================================================
    // Refresh User
    // ==========================================================================

    /**
     * Refresh user data from API
     * 
     * @returns {Promise<{success: boolean}>}
     */
    const refreshUser = useCallback(async () => {
        try {
            const result = await authApi.getUser();

            if (result.success) {
                setUser(result.data.user);
                return { success: true };
            }

            return { success: false };
        } catch (error) {
            return { success: false };
        }
    }, []);

    // ==========================================================================
    // Context Value
    // ==========================================================================

    const value = {
        // State
        user,
        token,
        isLoading,
        isAuthenticated,
        isGuest,

        // Methods
        setUser,
        login,
        register,
        logout,
        refreshUser,
        continueAsGuest,
        exitGuest,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// =============================================================================
// Custom Hook
// =============================================================================

/**
 * useAuth hook for accessing auth context
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
