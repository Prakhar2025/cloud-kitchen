import apiClient from './client';
import { ENDPOINTS } from '../utils/constants';

export const getMenu = async (params = {}) => {
    try {
        const response = await apiClient.get('/user/menu', { params });
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

export default {
    getMenu
};
