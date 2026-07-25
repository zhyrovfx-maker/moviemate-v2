import { MOCK_MOVIES } from '../data/mockMovies';
import { storage } from './storage';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

// Active Live TMDB API Keys
const PRIMARY_TMDB_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BACKUP_TMDB_KEY = '1cf50e6248dc270629e802686245c2c8';

export const tmdbApi = {
  getApiKey: () => {
    const settings = storage.getSettings();
    if (settings.tmdbApiKey && settings.tmdbApiKey.length > 10) {
      return settings.tmdbApiKey.trim();
    }
    return PRIMARY_TMDB_KEY;
  },

  // Helper to format TMDB response item into MovieMate format
  formatMovie: (movie) => {
    const poster = movie.poster_path
      ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE}${movie.poster_path}`)
      : 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg';

    const backdrop = movie.backdrop_path
      ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`)
      : poster;

    // Map TMDB genre IDs to names
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
      80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
      14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
      53: 'Thriller', 10752: 'War', 37: 'Western'
    };

    let genreNames = movie.genres
      ? movie.genres.map(g => (typeof g === 'object' ? g.name : g))
      : (movie.genre_ids ? movie.genre_ids.map(id => genreMap[id] || 'Cinema').filter(Boolean) : ['Cinema']);

    if (genreNames.length === 0) genreNames = ['Cinema'];

    return {
      id: movie.id,
      title: movie.title || movie.name || 'Untitled Movie',
      original_title: movie.original_title || movie.title,
      overview: movie.overview || 'No synopsis available for this film.',
      tagline: movie.tagline || '',
      poster_path: poster,
      backdrop_path: backdrop,
      vote_average: Number(movie.vote_average ? movie.vote_average.toFixed(1) : 7.5),
      vote_count: movie.vote_count || 500,
      release_date: movie.release_date || movie.first_air_date || 'N/A',
      year: movie.release_date ? movie.release_date.substring(0, 4) : (movie.first_air_date ? movie.first_air_date.substring(0, 4) : '2024'),
      runtime: movie.runtime || 125,
      genres: genreNames,
      genre_ids: genreNames.map(g => g.toLowerCase()),
      director: movie.director || 'Renowned Director',
      cast: movie.cast || ['Lead Actor', 'Supporting Actor'],
      youtube_trailer_id: movie.youtube_trailer_id || null,
      featured: movie.featured || false,
      trending: movie.trending || true
    };
  },

  // Fetch Comprehensive Live Movie Catalog (80+ TMDB movies across all categories & pages)
  getTrending: async () => {
    let apiKey = tmdbApi.getApiKey();
    try {
      const endpoints = [
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&page=1`,
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&page=2`,
        `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=1`,
        `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=2`,
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&page=1`,
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${apiKey}&page=1`
      ];

      const responses = await Promise.allSettled(endpoints.map(url => fetch(url).then(r => r.json())));
      
      const allMovies = [];
      const seenIds = new Set();

      responses.forEach(res => {
        if (res.status === 'fulfilled' && res.value && res.value.results) {
          res.value.results.forEach(m => {
            if (m && m.id && m.poster_path && !seenIds.has(m.id)) {
              seenIds.add(m.id);
              allMovies.push(m);
            }
          });
        }
      });

      if (allMovies.length > 0) {
        return allMovies.map((m, idx) => ({
          ...tmdbApi.formatMovie(m),
          featured: idx === 0
        }));
      }
    } catch (err) {
      console.warn('TMDB multi-fetch error, using fallback catalog:', err);
    }

    return MOCK_MOVIES.map(tmdbApi.formatMovie);
  },

  // Search Movies by Query across multiple pages from Live TMDB
  searchMovies: async (query) => {
    if (!query.trim()) return tmdbApi.getTrending();
    
    let apiKey = tmdbApi.getApiKey();
    try {
      const endpoints = [
        `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`,
        `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=2`
      ];

      const responses = await Promise.allSettled(endpoints.map(url => fetch(url).then(r => r.json())));
      
      const searchMoviesList = [];
      const seenIds = new Set();

      responses.forEach(res => {
        if (res.status === 'fulfilled' && res.value && res.value.results) {
          res.value.results.forEach(m => {
            if (m && m.id && m.poster_path && !seenIds.has(m.id)) {
              seenIds.add(m.id);
              searchMoviesList.push(m);
            }
          });
        }
      });

      if (searchMoviesList.length > 0) {
        return searchMoviesList.map(tmdbApi.formatMovie);
      }
    } catch (err) {
      console.warn('TMDB multi-search error, using fallback:', err);
    }

    // Local Search fallback
    const q = query.toLowerCase();
    const filtered = MOCK_MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q))
    );
    return filtered.map(tmdbApi.formatMovie);
  },

  // Get Detailed Movie Information including Trailer Videos & Cast
  getMovieDetails: async (movieId) => {
    let apiKey = tmdbApi.getApiKey();
    try {
      let res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}&append_to_response=videos,credits,similar`);
      if (!res.ok) {
        res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${BACKUP_TMDB_KEY}&append_to_response=videos,credits,similar`);
      }

      if (res.ok) {
        const data = await res.json();
        const formatted = tmdbApi.formatMovie(data);
        
        // Extract YouTube Trailer
        if (data.videos?.results) {
          const trailer = data.videos.results.find(
            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          ) || data.videos.results[0];
          if (trailer) formatted.youtube_trailer_id = trailer.key;
        }

        // Extract Director & Cast
        if (data.credits) {
          const dir = data.credits.crew?.find(c => c.job === 'Director');
          if (dir) formatted.director = dir.name;
          formatted.cast = data.credits.cast?.slice(0, 6).map(c => c.name) || [];
        }

        // Extract Similar Movies
        if (data.similar?.results) {
          formatted.similar = data.similar.results.slice(0, 4).map(tmdbApi.formatMovie);
        }

        return formatted;
      }
    } catch (e) {
      console.warn('TMDB details fallback to mock:', e);
    }

    // Mock details fallback
    const found = MOCK_MOVIES.find(m => m.id === Number(movieId)) || MOCK_MOVIES[0];
    const formatted = tmdbApi.formatMovie(found);
    formatted.similar = MOCK_MOVIES.filter(m => m.id !== found.id).slice(0, 4).map(tmdbApi.formatMovie);
    return formatted;
  }
};
