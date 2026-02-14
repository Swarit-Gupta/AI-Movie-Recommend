import api from './api';

const recommendationService = {
  // Get personalized recommendations
  getRecommendations: async (limit = 20) => {
    const response = await api.get(`/recommendations?limit=${limit}`);
    return response.data;
  }
};

export default recommendationService;
