import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import movieService from '../services/movie.service';
import ratingService from '../services/rating.service';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';
import Loading from '../components/Loading';
import { getImageUrl, getBackdropUrl, formatDate, formatRuntime } from '../utils/helpers';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await movieService.getMovieDetails(id);
        setMovie(movieData);

        if (isAuthenticated) {
          const ratingData = await ratingService.getUserMovieRating(id);
          if (ratingData.rating) {
            setUserRating(ratingData.rating.rating);
          }
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, isAuthenticated]);

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      setError('Please login to rate movies');
      return;
    }

    try {
      setRatingLoading(true);
      setError('');
      await ratingService.addRating(
        movie.id,
        rating,
        movie.title,
        movie.poster_path,
        movie.genres?.map(g => g.id)
      );
      setUserRating(rating);
      setSuccessMessage('Rating saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save rating');
      console.error(err);
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !movie) {
    return <div className="error-message">{error}</div>;
  }

  if (!movie) {
    return <div className="error-message">Movie not found</div>;
  }

  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="movie-detail">
      <div 
        className="movie-backdrop"
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="movie-content">
        <div className="movie-poster-container">
          <img 
            src={getImageUrl(movie.poster_path, 'w500')} 
            alt={movie.title}
            className="movie-poster-large"
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}

          <div className="movie-meta">
            <span className="meta-item">⭐ TMDB: {movie.vote_average?.toFixed(1)}/10</span>
            {movie.external_ids?.imdb_id && (
              <a 
                href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-item imdb-link"
              >
                🎬 View on IMDb
              </a>
            )}
            <span className="meta-item">📅 {formatDate(movie.release_date)}</span>
            <span className="meta-item">⏱️ {formatRuntime(movie.runtime)}</span>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {movie['watch/providers']?.results?.US && (
            <div className="streaming-providers">
              <h2>🎬 Where to Watch (US)</h2>
              
              {movie['watch/providers'].results.US.flatrate && (
                <div className="provider-section">
                  <h3>Streaming (Free with Subscription)</h3>
                  <div className="provider-list">
                    {movie['watch/providers'].results.US.flatrate.map((provider) => (
                      <div key={provider.provider_id} className="provider-item" title={provider.provider_name}>
                        <div 
                          className="provider-logo"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${provider.logo_path})`
                          }}
                          role="img"
                          aria-label={provider.provider_name}
                        />
                        <span className="provider-name">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie['watch/providers'].results.US.free && (
                <div className="provider-section">
                  <h3>Free with Ads</h3>
                  <div className="provider-list">
                    {movie['watch/providers'].results.US.free.map((provider) => (
                      <div key={provider.provider_id} className="provider-item" title={provider.provider_name}>
                        <div 
                          className="provider-logo"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${provider.logo_path})`
                          }}
                          role="img"
                          aria-label={provider.provider_name}
                        />
                        <span className="provider-name">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie['watch/providers'].results.US.rent && (
                <div className="provider-section">
                  <h3>Rent ($)</h3>
                  <div className="provider-list">
                    {movie['watch/providers'].results.US.rent.map((provider) => (
                      <div key={provider.provider_id} className="provider-item" title={provider.provider_name}>
                        <div 
                          className="provider-logo"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${provider.logo_path})`
                          }}
                          role="img"
                          aria-label={provider.provider_name}
                        />
                        <span className="provider-name">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie['watch/providers'].results.US.buy && (
                <div className="provider-section">
                  <h3>Buy ($$)</h3>
                  <div className="provider-list">
                    {movie['watch/providers'].results.US.buy.map((provider) => (
                      <div key={provider.provider_id} className="provider-item" title={provider.provider_name}>
                        <div 
                          className="provider-logo"
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${provider.logo_path})`
                          }}
                          role="img"
                          aria-label={provider.provider_name}
                        />
                        <span className="provider-name">{provider.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="movie-overview">
            <h2>Overview</h2>
            <p>{movie.overview || 'No overview available.'}</p>
          </div>

          {isAuthenticated && (
            <div className="movie-rating-section">
              <h3>Rate this movie:</h3>
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {error && <div className="error-text">{error}</div>}
              <Rating 
                initialRating={userRating || 0} 
                onRate={handleRate}
                readOnly={ratingLoading}
              />
              {userRating && (
                <p className="rating-text">Your rating: {userRating}/5</p>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="login-prompt">
              <p>Please login to rate this movie</p>
            </div>
          )}

          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="movie-cast">
              <h2>Cast</h2>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="cast-member">
                    {actor.profile_path ? (
                      <img 
                        src={getImageUrl(actor.profile_path, 'w185')} 
                        alt={actor.name}
                        className="cast-photo"
                      />
                    ) : (
                      <div className="cast-photo-placeholder">👤</div>
                    )}
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trailer && (
            <div className="movie-trailer">
              <h2>Trailer</h2>
              <div className="trailer-container">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
