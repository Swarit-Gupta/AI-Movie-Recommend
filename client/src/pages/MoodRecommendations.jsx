import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getMoodRecommendations } from '../services/mood.service';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import './MoodRecommendations.css';

const MoodRecommendations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState('');
  const [emotions, setEmotions] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const moodParam = searchParams.get('mood');
        const emotionsParam = searchParams.get('emotions');

        if (!moodParam) {
          setError('No mood detected. Please go back and detect your mood first.');
          setIsLoading(false);
          return;
        }

        setMood(moodParam);
        
        let parsedEmotions = null;
        if (emotionsParam) {
          try {
            parsedEmotions = JSON.parse(emotionsParam);
            setEmotions(parsedEmotions);
          } catch (e) {
            console.error('Error parsing emotions:', e);
          }
        }

        const data = await getMoodRecommendations(moodParam, parsedEmotions, 20);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Error fetching mood recommendations:', err);
        setError(err.response?.data?.message || 'Failed to fetch mood-based recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [searchParams]);

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
      surprised: '😲',
      neutral: '😐',
      excited: '🤩',
      calm: '😌',
      romantic: '😍'
    };
    return emojiMap[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: '#FFD700',
      sad: '#4682B4',
      angry: '#DC143C',
      fearful: '#9370DB',
      disgusted: '#8FBC8F',
      surprised: '#FF69B4',
      neutral: '#A9A9A9',
      excited: '#FF4500',
      calm: '#87CEEB',
      romantic: '#FF1493'
    };
    return colorMap[mood] || '#A9A9A9';
  };

  const getMoodMessage = (mood) => {
    const messages = {
      happy: 'Great vibes! Here are some movies to keep you smiling 😊',
      sad: 'We understand. These movies might resonate with you 💙',
      angry: 'Channel that energy! Check out these intense films 🔥',
      fearful: 'Embrace the thrill with these suspenseful picks 😨',
      disgusted: 'Time for something thought-provoking 🤔',
      surprised: 'Ready for more surprises? These will blow your mind! 🤯',
      neutral: 'Not sure what to watch? These popular picks are always good! 🎬',
      excited: 'Keep that energy up with these epic adventures! 🚀',
      calm: 'Relax and unwind with these peaceful selections 🧘',
      romantic: 'Love is in the air! Enjoy these heartwarming stories ❤️'
    };
    return messages[mood] || 'Here are some great movies for you!';
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="mood-recommendations-container">
        <div className="error-container">
          <h2>⚠️ {error}</h2>
          <button onClick={() => navigate('/mood-detection')} className="btn-primary">
            Go Back to Mood Detection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-recommendations-container">
      <div className="mood-header" style={{ borderBottomColor: getMoodColor(mood) }}>
        <button onClick={() => navigate('/mood-detection')} className="back-button">
          ← Back to Detection
        </button>
        
        <div className="mood-display">
          <div className="mood-emoji-large">{getMoodEmoji(mood)}</div>
          <div className="mood-text">
            <h1>
              Your Mood: <span style={{ color: getMoodColor(mood) }}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </span>
            </h1>
            <p className="mood-message">{getMoodMessage(mood)}</p>
          </div>
        </div>

        {emotions && (
          <div className="emotion-summary">
            <h3>Emotion Breakdown:</h3>
            <div className="emotion-chips">
              {Object.entries(emotions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([emotion, value]) => (
                  <span key={emotion} className="emotion-chip">
                    {emotion}: {(value * 100).toFixed(0)}%
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="recommendations-section">
        <div className="recommendations-info">
          <h2>🎬 Recommended Movies ({recommendations.length})</h2>
          <p>Personalized recommendations based on your current mood</p>
        </div>

        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            <p>No recommendations found for this mood. Try detecting your mood again!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showMoodScore={true} />
            ))}
          </div>
        )}
      </div>

      <div className="actions-footer">
        <button
          onClick={() => navigate('/mood-detection')}
          className="btn-secondary"
        >
          🎭 Detect Mood Again
        </button>
        <button
          onClick={() => navigate('/recommendations')}
          className="btn-primary"
        >
          🤖 Get AI Recommendations
        </button>
      </div>
    </div>
  );
};

export default MoodRecommendations;
