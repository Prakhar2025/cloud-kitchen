import apiClient from './client';

/**
 * Fetch all notifications for the authenticated user
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getNotifications = async () => {
    try {
        const response = await apiClient.get('/user/notifications');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to load notifications'
        };
    }
};

/**
 * Mark all notifications as read for the authenticated user
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const markNotificationsAsRead = async () => {
    try {
        const response = await apiClient.post('/user/notifications/mark-read');
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to mark notifications as read'
        };
    }
};

export default {
    getNotifications,
    markNotificationsAsRead
};
