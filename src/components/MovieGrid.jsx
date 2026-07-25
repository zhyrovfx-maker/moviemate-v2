import React from 'react';
import MovieCard from './MovieCard';
import { GENRES } from '../data/mockMovies';

export default function MovieGrid({ 
  movies, 
  selectedGenre, 
  setSelectedGenre, 
  sortBy, 
  setSortBy, 
  onSelectMovie, 
  onToggleWatchlist, 
  watchlist, 
  ratings 
}) {
  const watchlistIds = new Set(watchlist.map(item => item.id));

  // Strict Family-Friendly Guard (Excludes any adult, nudity, or explicit content)
  const isSafeContent = (movie) => {
    if (!movie) return false;
    if (movie.adult) return false;
    
    const adultKeywords = [
      'adult', 'erotic', 'hentai', 'sex', 'nude', 'nudity', 'porn', 
      'strip', 'explicit', 'sensual', 'playboy', '50 shades', 'fifty shades', 
      'euphoria', 'lust', 'passion', 'prostitute', 'brothel', 'stripper'
    ];
    
    const title = (movie.title || '').toLowerCase();
    const overview = (movie.overview || '').toLowerCase();
    const genres = (movie.genres || []).map(g => g.toLowerCase());
    
    if (genres.some(g => adultKeywords.some(k => g.includes(k)))) return false;
    if (adultKeywords.some(k => title.includes(k))) return false;
    if (adultKeywords.some(k => overview.includes(k))) return false;
    return true;
  };

  // Comprehensive Category & Genre Matcher (Movies, TV Series, Anime, K-Drama, Indian Cinema, etc.)
  const isGenreMatch = (movie, targetGenre) => {
    if (targetGenre === 'all') return true;
    if (!movie) return false;

    const target = targetGenre.toLowerCase();
    
    if (target === 'movie') {
      return !movie.is_series;
    }
    if (target === 'series') {
      return movie.is_series || (movie.genres && movie.genres.some(g => g.toLowerCase().includes('series') || g.toLowerCase().includes('tv')));
    }
    if (target === 'anime') {
      return movie.tag === 'anime' || (movie.genres && movie.genres.some(g => g.toLowerCase().includes('anime') || g.toLowerCase().includes('japan')));
    }
    if (target === 'kdrama') {
      return movie.tag === 'kdrama' || (movie.genres && movie.genres.some(g => g.toLowerCase().includes('kdrama') || g.toLowerCase().includes('korea')));
    }
    if (target === 'indian') {
      return movie.tag === 'indian' || (movie.genres && movie.genres.some(g => g.toLowerCase().includes('india') || g.toLowerCase().includes('indian')));
    }

    if (!movie.genres || movie.genres.length === 0) return false;

    return movie.genres.some(g => {
      const name = g.toLowerCase();
      if (target === 'sci-fi') {
        return name.includes('sci-fi') || name.includes('science fiction') || name.includes('scifi');
      }
      if (target === 'action') {
        return name.includes('action');
      }
      if (target === 'adventure') {
        return name.includes('adventure');
      }
      if (target === 'animation') {
        return name.includes('animation') || name.includes('animated');
      }
      if (target === 'thriller') {
        return name.includes('thriller') || name.includes('mystery') || name.includes('crime');
      }
      return name.includes(target);
    });
  };

  const filteredMovies = movies.filter(m => isSafeContent(m) && isGenreMatch(m, selectedGenre));

  return (
    <section style={{ marginTop: '1.5rem' }}>
      {/* Header Controls */}
      <div className="section-controls-header">
        {/* Category Pill Filter Tabs (Movies, TV Series, Anime, K-Drama, Indian Cinema, etc.) */}
        <div className="genre-pill-container">
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`genre-pill ${selectedGenre === g.id ? 'active' : ''}`}
            >
              <i className={`fa-solid ${g.icon}`} />
              {g.name}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              padding: '0.45rem 0.85rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Movies, Series & Anime Grid */}
      {filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              userRating={ratings[movie.id]?.rating}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: 'rgba(18, 24, 38, 0.5)',
          borderRadius: '20px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          margin: '2rem 0'
        }}>
          <div style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '1rem' }}>
            <i className="fa-solid fa-globe" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Titles Found in this Category
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Try selecting "All" or searching for a different title.
          </p>
          <button
            onClick={() => setSelectedGenre('all')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
          >
            Show All Titles
          </button>
        </div>
      )}
    </section>
  );
}
