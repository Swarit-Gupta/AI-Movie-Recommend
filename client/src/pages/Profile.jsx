import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ratingService from '../services/rating.service';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const data = await ratingService.getUserRatings(1, 50);
        setRatings(data.ratings);
      } catch (err) {
        setError('Failed to load your ratings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{ratings.length}</h3>
            <p>Movies Rated</p>
          </div>
          <div className="stat-card">
            <h3>
              {ratings.length > 0
                ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                : '0'}
            </h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 className="section-title">Your Rated Movies</h2>

        {error && <div className="error-message">{error}</div>}

        {ratings.length === 0 ? (
          <div className="no-ratings">
            <h3>No rated movies yet</h3>
            <p>Start rating movies to see them here!</p>
          </div>
        ) : (
          <div className="ratings-grid">
            {ratings.map((rating) => (
              <MovieCard
                key={rating.movieId}
                movie={{
                  id: rating.movieId,
                  title: rating.movieTitle,
                  poster_path: rating.moviePoster,
                  vote_average: 0,
                  release_date: ''
                }}
                userRating={rating.rating}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
