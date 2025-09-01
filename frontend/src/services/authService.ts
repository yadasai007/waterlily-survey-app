import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export const surveyService = {
  getSurvey: async (surveyId: number) => {
    const response = await api.get(`/surveys/${surveyId}`);
    return response.data;
  },

  submitResponse: async (surveyId: number, answers: any[]) => {
    const response = await api.post(`/surveys/${surveyId}/responses`, { answers });
    return response.data;
  }
};

export const responseService = {
  getResponse: async (responseId: number) => {
    const response = await api.get(`/responses/${responseId}`);
    return response.data;
  },

  getUserResponses: async () => {
    const response = await api.get('/responses/user');
    return response.data;
  }
};

export default api;