import apiClient from './client';

export const updateProfile = async (userData) => {
    try {
        const response = await apiClient.post('/user/profile/update', userData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Profile update failed',
            errors: error.response?.data?.errors
        };
    }
};

export const getAddresses = async () => {
    try {
        const response = await apiClient.get('/user/addresses');
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

export const addAddress = async (addressData) => {
    try {
        const response = await apiClient.post('/user/addresses', addressData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to add address',
            errors: error.response?.data?.errors
        };
    }
};

export const updateAddress = async (id, addressData) => {
    try {
        const response = await apiClient.put(`/user/addresses/${id}`, addressData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to update address',
            errors: error.response?.data?.errors
        };
    }
};

export const deleteAddress = async (id) => {
    try {
        const response = await apiClient.delete(`/user/addresses/${id}`);
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
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};
