import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';
import './MovieCard.css';

const MovieCard = ({ movie, showRating = false, userRating = null, showMoodScore = false }) => {
  const { id, title, poster_path, vote_average, release_date, moodScore, moodMatch } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="movie-card-image">
        <img 
          src={getImageUrl(poster_path, 'w342')} 
          alt={title}
          loading="lazy"
        />
        {vote_average > 0 && (
          <div className="movie-card-rating">
            ⭐ {vote_average.toFixed(1)}
          </div>
        )}
        {userRating && (
          <div className="movie-card-user-rating">
            ❤️ {userRating}
          </div>
        )}
        {showMoodScore && moodScore && (
          <div className="movie-card-mood-score">
            🎭 {Math.round(moodScore)}
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        {release_date && (
          <p className="movie-card-year">{new Date(release_date).getFullYear()}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
