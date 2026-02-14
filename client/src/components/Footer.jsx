import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            🎬 MovieAI - AI-Powered Movie Recommendations
          </p>
          <p className="footer-text">
            © 2024 MovieAI. All rights reserved.
          </p>
          <p className="footer-text">
            Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
