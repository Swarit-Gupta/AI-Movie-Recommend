import { useState } from 'react';
import './Rating.css';

const Rating = ({ initialRating = 0, onRate, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (!readOnly) {
      setRating(value);
      if (onRate) {
        onRate(value);
      }
    }
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hover || rating) ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Rating;
