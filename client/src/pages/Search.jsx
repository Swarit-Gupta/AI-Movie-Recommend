import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import movieService from '../services/movie.service';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './Search.css';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError('');
      setQuery(searchQuery);
      setHasSearched(true);
      
      const results = await movieService.searchMovies(searchQuery);
      setMovies(results.results);
      
      if (results.results.length === 0) {
        setError('No movies found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Movies</h1>
        <p>Find your favorite movies by title</p>
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="search-results">
        {loading && <Loading />}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && hasSearched && movies.length > 0 && (
          <>
            <h2 className="results-title">
              Search results for "{query}" ({movies.length} movies found)
            </h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}

        {!loading && !hasSearched && (
          <div className="search-placeholder">
            <h2>🔍 Start searching for movies</h2>
            <p>Enter a movie title above to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
