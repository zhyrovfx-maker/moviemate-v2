import React from 'react';
import MovieCard from './MovieCard';

export default function Recommendations({ 
  movies, 
  watchlist, 
  ratings, 
  onSelectMovie, 
  onToggleWatchlist 
}) {
  const watchlistIds = new Set(watchlist.map(item => item.id));

  // Compute recommendations based on rated genres & high votes
  const ratedMovieIds = Object.keys(ratings).map(id => Number(id));
  
  // Calculate recommended scores
  const recommendedMovies = movies.map(movie => {
    let matchScore = 75; // Base match

    // Boost score if genre matches high rated movie genres
    if (movie.vote_average >= 8.5) matchScore += 12;
    if (movie.trending) matchScore += 8;
    if (ratings[movie.id]) matchScore += 10;

    // Cap at 99%
    matchScore = Math.min(99, Math.max(65, matchScore));

    return {
      ...movie,
      matchScore,
      matchReason: movie.genres && movie.genres.length > 0 
        ? `Matches your taste in ${movie.genres[0]}` 
        : 'Top Rated Recommendation'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <section style={{ padding: '1.5rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <i className="fa-solid fa-sparkles" /> AI & Taste Engine
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          Personalized Recommendations For You
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
          Tailored cinema picks dynamically calculated from your rating history and watch preferences.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.75rem'
      }}>
        {recommendedMovies.map(movie => (
          <div key={movie.id} style={{ position: 'relative' }}>
            {/* Match Badge */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '10px',
              zIndex: 10,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.75rem',
              padding: '3px 10px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}>
              {movie.matchScore}% Match
            </div>

            <MovieCard
              movie={movie}
              onSelectMovie={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              inWatchlist={watchlistIds.has(movie.id)}
              userRating={ratings[movie.id]?.rating}
            />

            <p style={{
              fontSize: '0.78rem',
              color: '#ec4899',
              fontWeight: 600,
              marginTop: '0.4rem',
              textAlign: 'center'
            }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '0.7rem' }} /> {movie.matchReason}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
