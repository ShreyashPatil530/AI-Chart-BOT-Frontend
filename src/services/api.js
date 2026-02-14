import axios from 'axios';

const api = axios.create({
    baseURL: '/api/chat',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatService = {
    sendMessage: async (sessionId, prompt) => {
        try {
            const response = await api.post('/', { sessionId, prompt });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getHistory: async (sessionId) => {
        try {
            const response = await api.get(`/history/${sessionId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    checkHealth: async () => {
        try {
            const response = await axios.get('/api/health');
            return response.data;
        } catch (error) {
            return { success: false, message: 'Backend is offline' };
        }
    },
};

export default api;
