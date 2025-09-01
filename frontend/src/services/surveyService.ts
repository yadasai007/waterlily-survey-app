import api from './api';

export const surveyService = {
  getSurveys: async () => {
    const response = await api.get('/surveys');
    return response.data;
  },

  getSurvey: async (surveyId: number) => {
    const response = await api.get(`/surveys/${surveyId}`);
    return response.data;
  },

  submitResponse: async (surveyId: number, answers: any[]) => {
    const response = await api.post(`/surveys/${surveyId}/responses`, { answers });
    return response.data;
  }
};