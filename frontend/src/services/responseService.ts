import api from './api'

export const responseService = {
  getResponse: async (responseId: number) => {
    const response = await api.get(`/responses/${responseId}`)
    return response.data
  },

  getUserResponses: async () => {
    const response = await api.get('/responses/user')
    return response.data
  }
}