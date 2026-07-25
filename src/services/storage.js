const WATCHLIST_KEY = 'moviemate_v2_watchlist';
const RATINGS_KEY = 'moviemate_v2_ratings';
const REVIEWS_KEY = 'moviemate_v2_reviews';
const SETTINGS_KEY = 'moviemate_v2_settings';

export const storage = {
  // Watchlist
  getWatchlist: () => {
    try {
      const data = localStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading watchlist from storage:', e);
      return [];
    }
  },

  saveWatchlist: (watchlist) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Error saving watchlist to storage:', e);
    }
  },

  toggleWatchlist: (movie, status = 'want') => {
    const list = storage.getWatchlist();
    const existingIndex = list.findIndex((item) => item.id === movie.id);
    
    if (existingIndex > -1) {
      // If already has this status, remove it
      if (list[existingIndex].status === status) {
        list.splice(existingIndex, 1);
      } else {
        // Change status
        list[existingIndex].status = status;
        list[existingIndex].updatedAt = new Date().toISOString();
      }
    } else {
      // Add new
      list.unshift({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genres: movie.genres || [],
        status: status, // 'want' | 'watched'
        addedAt: new Date().toISOString()
      });
    }

    storage.saveWatchlist(list);
    return list;
  },

  // Ratings
  getRatings: () => {
    try {
      const data = localStorage.getItem(RATINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  setRating: (movieId, rating) => {
    const ratings = storage.getRatings();
    if (rating === 0) {
      delete ratings[movieId];
    } else {
      ratings[movieId] = {
        rating: rating,
        timestamp: new Date().toISOString()
      };
    }
    try {
      localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (e) {
      console.error('Error saving ratings:', e);
    }
    return ratings;
  },

  // Reviews
  getReviews: () => {
    try {
      const data = localStorage.getItem(REVIEWS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  addReview: (movieId, reviewText, author = 'You') => {
    const reviews = storage.getReviews();
    if (!reviews[movieId]) {
      reviews[movieId] = [];
    }
    reviews[movieId].unshift({
      id: Date.now(),
      author: author,
      content: reviewText,
      date: new Date().toLocaleDateString()
    });
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving review:', e);
    }
    return reviews;
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : { tmdbApiKey: '', useLiveApi: false };
    } catch (e) {
      return { tmdbApiKey: '', useLiveApi: false };
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Export / Import
  exportData: () => {
    const data = {
      watchlist: storage.getWatchlist(),
      ratings: storage.getRatings(),
      reviews: storage.getReviews(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.watchlist) storage.saveWatchlist(data.watchlist);
      if (data.ratings) localStorage.setItem(RATINGS_KEY, JSON.stringify(data.ratings));
      if (data.reviews) localStorage.setItem(REVIEWS_KEY, JSON.stringify(data.reviews));
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
};
