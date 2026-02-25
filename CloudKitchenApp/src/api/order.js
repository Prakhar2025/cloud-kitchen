import apiClient from './client';

export const getOrders = async () => {
    try {
        const response = await apiClient.get('/user/orders');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Place an order - sends address_id and payment_method only.
 * Server calculates total from cart items (same as web).
 * @param {Object} orderData - {address_id: number, payment_method: 'cod'|'online'}
 * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
 */
export const placeOrder = async (orderData) => {
    try {
        const response = await apiClient.post('/user/orders/place', orderData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await apiClient.post(`/user/orders/${orderId}/cancel`);
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Rate an order with stars and optional review
 * @param {number} orderId - The order ID to rate
 * @param {Object} ratingData - {stars: number (1-5), review: string (optional)}
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const rateOrder = async (orderId, ratingData) => {
    try {
        const response = await apiClient.post(`/user/orders/${orderId}/rate`, ratingData);
        return {
            success: true,
            message: response.data.message || 'Rating submitted successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to submit rating'
        };
    }
};

export default {
    getOrders,
    placeOrder,
    cancelOrder,
    rateOrder
};
