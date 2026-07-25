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

  return (
    <section style={{ marginTop: '1.5rem' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {/* Genre Pill Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          maxWidth: '100%'
        }}>
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              style={{
                background: selectedGenre === g.id 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                  : 'rgba(18, 24, 38, 0.75)',
                border: selectedGenre === g.id 
                  ? 'none' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedGenre === g.id ? '#ffffff' : '#94a3b8',
                padding: '0.55rem 1.1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: selectedGenre === g.id ? '0 4px 15px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              <i className={`fa-solid ${g.icon}`} />
              {g.name}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
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
      {movies.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '1.5rem'
        }}>
          {movies.map(movie => (
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
          padding: '4rem 2rem',
          background: 'rgba(18, 24, 38, 0.5)',
          borderRadius: '20px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          margin: '2rem 0'
        }}>
          <div style={{
            fontSize: '3rem',
            color: '#6366f1',
            marginBottom: '1rem'
          }}>
            <i className="fa-solid fa-film" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Movies Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Try adjusting your search query or switching genre filters.
          </p>
        </div>
      )}
    </section>
  );
}
