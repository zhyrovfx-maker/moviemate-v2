import { MOCK_MOVIES } from '../data/mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

// Active Live TMDB API Keys
const PRIMARY_TMDB_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BACKUP_TMDB_KEY = '1cf50e6248dc270629e802686245c2c8';

// Robust fetch helper with Vercel Cloud Server Proxy + direct fallback
async function fetchTMDB(path, params = {}) {
  // Strategy 1: Try Vercel Serverless Proxy (Bypasses all Mobile ISP / Jio / Airtel / CORS blocks)
  try {
    const proxyParams = new URLSearchParams({ endpoint: path, ...params });
    const proxyUrl = `/api/tmdb?${proxyParams.toString()}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && (data.results || data.id)) return data;
    }
  } catch (e) {
    // Proxy not available locally or static dev
  }

  // Strategy 2: Direct Fetch with Primary Key
  const queryParams = new URLSearchParams({ ...params, api_key: PRIMARY_TMDB_KEY });
  let directUrl = `${TMDB_BASE_URL}${path}?${queryParams.toString()}`;

  try {
    let res = await fetch(directUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.results || data.id)) return data;
    }
    
    // Strategy 3: Direct Fetch with Backup Key
    queryParams.set('api_key', BACKUP_TMDB_KEY);
    directUrl = `${TMDB_BASE_URL}${path}?${queryParams.toString()}`;
    res = await fetch(directUrl);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('TMDB Fetch exception:', path, err);
  }
  return null;
}

export const tmdbApi = {
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
      trending: movie.trending || true,
      is_series: movie.is_series || false,
      tag: movie.tag || ''
    };
  },

  // Fetch Comprehensive Live Movie Catalog
  getTrending: async () => {
    return MOCK_MOVIES.map(tmdbApi.formatMovie);
  },

  // Search Movies by Query across catalog
  searchMovies: async (query) => {
    if (!query.trim()) return tmdbApi.getTrending();

    const q = query.toLowerCase();
    const filtered = MOCK_MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q))
    );
    return filtered.map(tmdbApi.formatMovie);
  },

  // Get Detailed Movie Information
  getMovieDetails: async (movieId) => {
    // Check local clean catalog first to prevent TMDB ID collision overwrites
    const localFound = MOCK_MOVIES.find(m => m.id === Number(movieId));
    if (localFound) {
      const formatted = tmdbApi.formatMovie(localFound);
      formatted.similar = MOCK_MOVIES.filter(m => m.id !== localFound.id && m.is_series === localFound.is_series).slice(0, 4).map(tmdbApi.formatMovie);
      return formatted;
    }

    try {
      const data = await fetchTMDB(`/movie/${movieId}`, { append_to_response: 'videos,credits,similar' });
      if (data && !data.adult) {
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
