const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return '/placeholder-backdrop.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
