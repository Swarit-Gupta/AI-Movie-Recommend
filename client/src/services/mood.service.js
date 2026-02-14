import api from './api';

// Get mood-based recommendations
export const getMoodRecommendations = async (mood, emotions, limit = 20) => {
  const response = await api.post('/mood/recommendations', {
    mood,
    emotions
  }, {
    params: { limit }
  });
  return response.data;
};

// Get genres for a specific mood
export const getMoodGenres = async (mood) => {
  const response = await api.get(`/mood/genres/${mood}`);
  return response.data;
};

// Get all supported moods
export const getSupportedMoods = async () => {
  const response = await api.get('/mood/list');
  return response.data;
};
