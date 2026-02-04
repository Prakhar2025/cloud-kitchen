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

export default {
    getOrders,
    placeOrder,
    cancelOrder
};
