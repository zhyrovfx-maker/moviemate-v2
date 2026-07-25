import React from 'react';

export default function HeroBanner({ movie, onSelectMovie, onToggleWatchlist, inWatchlist }) {
  if (!movie) return null;

  const rating5 = (movie.vote_average / 2).toFixed(1);

  return (
    <section 
      className="hero-banner"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(7, 7, 10, 1) 0%, rgba(7, 7, 10, 0.4) 50%, rgba(30, 8, 10, 0.75) 100%), url("${movie.backdrop_path}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '24px',
        padding: '3.5rem 3rem',
        margin: '1.5rem 0 2.5rem 0',
        minHeight: '460px',
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ maxWidth: '750px', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'linear-gradient(135deg, #e50914, #991b1b)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.5)'
          }}>
            Featured Cinema
          </span>
          <span style={{
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: '#fbbf24',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <i className="fa-solid fa-star" /> {rating5} / 5
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{movie.year}</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{movie.runtime} min</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 800,
          color: '#f8fafc',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)'
        }}>
          {movie.title}
        </h1>

        <p style={{
          color: '#cbd5e1',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          marginBottom: '1.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)'
        }}>
          {movie.overview}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onSelectMovie(movie)}
          >
            <i className="fa-solid fa-play" /> View Details & Trailer
          </button>

          <button 
            className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => onToggleWatchlist(movie)}
          >
            <i className={`fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'}`} />
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </section>
  );
}
