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

  // Flexible Genre Matcher
  const isGenreMatch = (movieGenres, targetGenre) => {
    if (targetGenre === 'all') return true;
    if (!movieGenres || movieGenres.length === 0) return false;

    const target = targetGenre.toLowerCase();
    return movieGenres.some(g => {
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

  const filteredMovies = movies.filter(m => isGenreMatch(m.genres, selectedGenre));

  return (
    <section style={{ marginTop: '1.5rem' }}>
      {/* Header Controls */}
      <div className="section-controls-header">
        {/* Genre Pill Filter Tabs */}
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

      {/* Movies Grid */}
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
            <i className="fa-solid fa-film" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Movies Found in this Category
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Try selecting "All Genres" or searching for a different movie title.
          </p>
          <button
            onClick={() => setSelectedGenre('all')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
          >
            Show All Movies
          </button>
        </div>
      )}
    </section>
  );
}
