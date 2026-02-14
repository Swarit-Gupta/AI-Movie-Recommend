import { useState, useEffect } from 'react';
import recommendationService from '../services/recommendation.service';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await recommendationService.getRecommendations(20);
        setRecommendations(data.recommendations);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h1>🎬 Recommended for You</h1>
        <p>Personalized movie recommendations based on your ratings and preferences</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <h2>No recommendations yet</h2>
          <p>Start rating movies to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
