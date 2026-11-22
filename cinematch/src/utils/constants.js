// Option lists shown in the filter panel. Every option has a `value` and a `label`
// so they can be passed straight into <ChipGroup />.

export const GENRES = [
  { value: 28, label: 'Action' },
  { value: 35, label: 'Comedy' },
  { value: 10749, label: 'Romance' },
  { value: 27, label: 'Horror' },
  { value: 53, label: 'Thriller' },
  { value: 878, label: 'Sci-Fi' },
  { value: 18, label: 'Drama' },
  { value: 16, label: 'Animation' },
];

// Full TMDB genre map, used to label genres on list results (which only carry ids).
export const GENRE_NAMES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
];

// Moods map to the genres that usually deliver that feeling.
export const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😄', genres: [35, 16, 10751] },
  { value: 'sad', label: 'Sad', emoji: '😢', genres: [18, 10749] },
  { value: 'excited', label: 'Excited', emoji: '🤩', genres: [28, 12, 878, 53] },
  { value: 'romantic', label: 'Romantic', emoji: '💕', genres: [10749, 35] },
  { value: 'scared', label: 'Scared', emoji: '😱', genres: [27, 53, 9648] },
  { value: 'relaxed', label: 'Relaxed', emoji: '😌', genres: [35, 10751, 16, 14] },
];

export const DURATIONS = [
  { value: 'short', label: 'Under 90 min', min: null, max: 89 },
  { value: 'medium', label: '90–120 min', min: 90, max: 120 },
  { value: 'long', label: 'Above 120 min', min: 121, max: null },
];

export const MOVIE_TYPES = [
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'underrated', label: 'Underrated' },
  { value: 'classic', label: 'Classic' },
];

// `ids` are TMDB watch-provider ids (a platform can have several regional ids).
export const PLATFORMS = [
  { value: 'any', label: 'Any Platform', ids: [] },
  { value: 'netflix', label: 'Netflix', ids: [8] },
  { value: 'prime', label: 'Amazon Prime Video', ids: [9, 119] },
  { value: 'disney', label: 'Disney+', ids: [337, 122] }, // 122 = Disney+ Hotstar (India)
  { value: 'youtube', label: 'YouTube', ids: [192, 188] },
];

export const SORT_OPTIONS = [
  { value: 'best', label: 'Best Match' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Latest Releases' },
  { value: 'oldest', label: 'Oldest Releases' },
  { value: 'shortest', label: 'Shortest Duration' },
  { value: 'longest', label: 'Longest Duration' },
];
