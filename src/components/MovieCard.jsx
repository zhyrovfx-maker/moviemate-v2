import React from 'react';

export default function MovieCard({ 
  movie, 
  onSelectMovie, 
  onToggleWatchlist, 
  inWatchlist, 
  userRating 
}) {
  const rating5 = (movie.vote_average / 2).toFixed(1);

  return (
    <div 
      className="movie-card" 
      onClick={() => onSelectMovie(movie)}
      style={{
        background: 'rgba(20, 10, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Poster Media Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '145%', overflow: 'hidden' }}>
        <img 
          src={movie.poster_path} 
          alt={movie.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />

        {/* 5-Star Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(7, 7, 10, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          padding: '4px 8px',
          color: '#fbbf24',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 3
        }}>
          <i className="fa-solid fa-star" /> {rating5} / 5
        </div>

        {/* Quick Bookmark Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: inWatchlist 
              ? 'linear-gradient(135deg, #e50914, #991b1b)' 
              : 'rgba(7, 7, 10, 0.8)',
            backdropFilter: 'blur(8px)',
            border: inWatchlist ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            boxShadow: inWatchlist ? '0 0 12px rgba(229, 9, 20, 0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <i className={`fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'}`} style={{ fontSize: '0.85rem' }} />
        </button>

        {/* User Rating Indicator Badge */}
        {userRating && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(229, 9, 20, 0.9)',
            backdropFilter: 'blur(6px)',
            borderRadius: '8px',
            padding: '3px 8px',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 3
          }}>
            My Rating: <i className="fa-solid fa-star" style={{ color: '#fbbf24' }} /> {userRating}/5
          </div>
        )}

        {/* Red hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(229, 9, 20, 0.3) 0%, transparent 60%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1,
          pointerEvents: 'none'
        }} className="card-hover-overlay" />
      </div>

      {/* Info Body */}
      <div style={{ padding: '0.9rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.3,
            marginBottom: '0.3rem',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span style={{ color: '#f87171', fontWeight: 600 }}>{movie.genres[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
