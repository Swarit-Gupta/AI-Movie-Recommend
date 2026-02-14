import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" className="logo-svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#e50914', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#ff1744', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path
                d="M20 2 L38 12 L38 28 L20 38 L2 28 L2 12 Z"
                fill="url(#logoGradient)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              <text
                x="20"
                y="27"
                fontSize="20"
                fontWeight="700"
                textAnchor="middle"
                fill="white"
                fontFamily="Inter, sans-serif"
              >
                M
              </text>
            </svg>
          </div>
          <span className="logo-text">
            <span className="logo-text-main">Movie</span>
            <span className="logo-text-accent">AI</span>
          </span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/search" className="navbar-link">
            Search
          </Link>
          <Link to="/mood-detection" className="navbar-link navbar-link-mood">
            🎭 Mood Detection
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/recommendations" className="navbar-link">
                Recommendations
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/register" className="navbar-button navbar-button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
