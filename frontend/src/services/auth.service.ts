import api from '../lib/axios';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    verifyOTP: async (data: { email: string; code: string }) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    resendOTP: async (email: string) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },
};
