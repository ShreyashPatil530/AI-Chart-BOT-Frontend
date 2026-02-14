import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatService = {
    sendMessage: async (sessionId, prompt) => {
        try {
            const response = await api.post('/chat', { sessionId, prompt });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getHistory: async (sessionId) => {
        try {
            const response = await api.get(`/chat/history/${sessionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    checkHealth: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            return { success: false, message: 'Backend is offline' };
        }
    },
};

export default api;
