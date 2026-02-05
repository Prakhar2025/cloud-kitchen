import apiClient from './client';

export const getCart = async () => {
    try {
        const response = await apiClient.get('/user/cart');
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

export const addToCart = async (foodId) => {
    try {
        const response = await apiClient.post(`/user/cart/${foodId}/add`);
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

export const decreaseQuantity = async (foodId) => {
    try {
        const response = await apiClient.post(`/user/cart/${foodId}/decrease`);
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

export const removeFromCart = async (foodId) => {
    try {
        const response = await apiClient.delete(`/user/cart/${foodId}`);
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
    getCart,
    addToCart,
    decreaseQuantity,
    removeFromCart
};
