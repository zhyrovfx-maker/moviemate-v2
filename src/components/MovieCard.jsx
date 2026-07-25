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
        background: 'rgba(18, 24, 38, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
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
          top: '12px',
          right: '12px',
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
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
            top: '12px',
            left: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: inWatchlist ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(8px)',
            border: inWatchlist ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'transform 0.2s ease'
          }}
        >
          <i className={`fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'}`} style={{ fontSize: '0.85rem' }} />
        </button>

        {/* User Rating Indicator Badge */}
        {userRating && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(236, 72, 153, 0.9)',
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
            Your Rating: <i className="fa-solid fa-star" style={{ color: '#fff' }} /> {userRating}/5
          </div>
        )}
      </div>

      {/* Info Body */}
      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.3,
            marginBottom: '0.35rem',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{movie.genres[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
