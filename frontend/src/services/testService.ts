import api from './api'

export const testService = {
  getTestData: async () => {
    const response = await api.get('/test')
    return response.data
  },

  createTestSurvey: async (title: string, description: string) => {
    const response = await api.post('/test/survey', { title, description })
    return response.data
  }
}