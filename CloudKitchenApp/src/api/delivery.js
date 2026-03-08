import apiClient from './client';

export const getDashboardInfo = async () => {
    try {
        const response = await apiClient.get('/delivery/dashboard');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
};

export const getHistory = async () => {
    try {
        const response = await apiClient.get('/delivery/history');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order history');
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await apiClient.post(`/delivery/orders/${orderId}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
};

export const updateLocation = async (latitude, longitude) => {
    try {
        const response = await apiClient.post('/delivery/location', { latitude, longitude });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update location');
    }
};
