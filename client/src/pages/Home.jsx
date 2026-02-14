import { useState, useEffect } from 'react';
import movieService from '../services/movie.service';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popular, topRated, nowPlaying] = await Promise.all([
          movieService.getPopularMovies(1),
          movieService.getTopRatedMovies(1),
          movieService.getNowPlayingMovies(1)
        ]);

        setPopularMovies(popular.results.slice(0, 12));
        setTopRatedMovies(topRated.results.slice(0, 12));
        setNowPlayingMovies(nowPlaying.results.slice(0, 12));
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Movie</h1>
          <p className="hero-subtitle">
            AI-powered recommendations tailored just for you
          </p>
          {isAuthenticated ? (
            <Link to="/recommendations" className="hero-button">
              Get Personalized Recommendations
            </Link>
          ) : (
            <Link to="/register" className="hero-button">
              Sign Up to Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="movies-section">
        <h2 className="section-title">Popular Movies</h2>
        <div className="movies-grid">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="movies-section">
        <h2 className="section-title">Top Rated</h2>
        <div className="movies-grid">
          {topRatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="movies-section">
        <h2 className="section-title">Now Playing</h2>
        <div className="movies-grid">
          {nowPlayingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
