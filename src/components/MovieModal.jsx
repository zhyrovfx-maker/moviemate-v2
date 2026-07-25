import React, { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';

export default function MovieModal({ 
  movie, 
  onClose, 
  onToggleWatchlist, 
  inWatchlist, 
  userRating, 
  onSetRating, 
  userReviews, 
  onAddReview,
  onSelectMovie 
}) {
  const [detailedMovie, setDetailedMovie] = useState(movie);
  const [showTrailer, setShowTrailer] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewInput, setReviewInput] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadDetails() {
      if (movie.id >= 800000) {
        setDetailedMovie(movie);
        return;
      }
      const details = await tmdbApi.getMovieDetails(movie.id);
      if (isMounted && details) {
        setDetailedMovie(details);
      }
    }
    loadDetails();
    return () => { isMounted = false; };
  }, [movie]);

  if (!movie) return null;

  const currentMovie = detailedMovie || movie;
  const currentReviews = userReviews[movie.id] || [];

  // Convert 10-point TMDB rating to 5-star scale for display
  const starRating5 = (currentMovie.vote_average / 2).toFixed(1);

  // Normalize user rating to 5-star scale
  const normalizedUserRating = userRating 
    ? (userRating > 5 ? Math.round(userRating / 2) : userRating)
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewInput.trim()) return;
    onAddReview(movie.id, reviewInput.trim());
    setReviewInput('');
  };

  // Direct YouTube On-Page Embed URL
  const trailerId = currentMovie.youtube_trailer_id || 'Way9Dexny3w';
  const embedUrl = `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(20px)',
      zIndex: 9000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        maxWidth: '960px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        position: 'relative',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '1rem',
            right: '1rem',
            float: 'right',
            marginRight: '1rem',
            marginTop: '1rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#fff',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100
          }}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Backdrop Header */}
        <div style={{
          position: 'relative',
          height: '280px',
          backgroundImage: `linear-gradient(to top, #0d1322 0%, rgba(13, 19, 34, 0.3) 100%), url("${currentMovie.backdrop_path}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1.5rem',
          clear: 'both'
        }}>
          {/* Play On-Page Trailer Button */}
          <button
            onClick={() => setShowTrailer(!showTrailer)}
            className="btn btn-primary"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '0.75rem 1.6rem',
              fontSize: '0.95rem',
              boxShadow: '0 0 35px rgba(99, 102, 241, 0.65)',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={`fa-solid ${showTrailer ? 'fa-xmark' : 'fa-play'}`} />
            {showTrailer ? 'Close Trailer Player' : 'Watch Official Trailer'}
          </button>
        </div>

        {/* INLINE ON-PAGE EMBEDDED YOUTUBE TRAILER PLAYER */}
        {showTrailer && (
          <div style={{ padding: '1rem', background: '#000', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
              <iframe
                src={embedUrl}
                title={`${currentMovie.title} Official Trailer`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          <div className="modal-grid-container" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.75rem' }}>
            {/* Left Column */}
            <div>
              <img
                src={currentMovie.poster_path}
                alt={currentMovie.title}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  marginBottom: '1rem'
                }}
              />

              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '0.6rem' }}
              >
                <i className={`fa-solid ${showTrailer ? 'fa-xmark' : 'fa-play'}`} />
                {showTrailer ? 'Close Player' : 'Watch Trailer'}
              </button>

              <button
                onClick={() => onToggleWatchlist(currentMovie)}
                className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}
              >
                <i className={`fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'}`} />
                {inWatchlist ? 'In Watchlist' : 'Add Watchlist'}
              </button>
            </div>

            {/* Right Column */}
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.3rem' }}>
                {currentMovie.title}
              </h2>

              {currentMovie.tagline && (
                <p style={{ color: '#ec4899', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  "{currentMovie.tagline}"
                </p>
              )}

              {/* Genre Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {currentMovie.genres?.map((g, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#818cf8',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}>
                    {g}
                  </span>
                ))}
              </div>

              {/* Meta stats bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(18, 24, 38, 0.8)',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>AUDIENCE RATING</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>
                    <i className="fa-solid fa-star" /> {starRating5} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ 5</span>
                  </span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>RELEASE YEAR</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{currentMovie.year}</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>RUNTIME</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{currentMovie.runtime} min</span>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Synopsis
                </h4>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.92rem' }}>
                  {currentMovie.overview}
                </p>
              </div>

              {/* 5-STAR RATING PICKER */}
              <div style={{
                background: 'rgba(18, 24, 38, 0.9)',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Rate this Title (5-Star System)
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => onSetRating(currentMovie.id, star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.75rem',
                        cursor: 'pointer',
                        color: star <= (hoverRating || normalizedUserRating || 0) ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)',
                        transition: 'transform 0.15s ease'
                      }}
                      title={`${star} Star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: '10px', fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>
                    {normalizedUserRating ? `${normalizedUserRating} / 5 Stars` : 'Not Rated'}
                  </span>
                </div>
              </div>

              {/* User Reviews */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                  User Reviews ({currentReviews.length})
                </h4>

                <form onSubmit={handleReviewSubmit} style={{ marginBottom: '1.25rem' }}>
                  <textarea
                    rows="3"
                    placeholder="Write your review for this title..."
                    value={reviewInput}
                    onChange={(e) => setReviewInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(18, 24, 38, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      outline: 'none',
                      marginBottom: '0.5rem',
                      resize: 'vertical'
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}>
                    Submit Review
                  </button>
                </form>

                {currentReviews.map(rev => (
                  <div key={rev.id} style={{
                    background: 'rgba(18, 24, 38, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    marginBottom: '0.6rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#6366f1' }}>{rev.author}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{rev.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>{rev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
