import React from 'react';

export default function Analytics({ watchlist, ratings, reviews, movies }) {
  const watchedList = watchlist.filter(item => item.status === 'watched');
  const wantList = watchlist.filter(item => (item.status || 'want') === 'want');

  const ratingValues = Object.values(ratings).map(r => r.rating);
  const avgUserRating = ratingValues.length > 0
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
    : 'N/A';

  // Total watch hours calculation (avg 130 min per movie)
  const totalWatchMinutes = watchedList.length * 130;
  const totalWatchHours = (totalWatchMinutes / 60).toFixed(1);

  // Genre breakdown stats
  const genreCounts = {};
  watchlist.forEach(item => {
    (item.genres || ['General']).forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const maxGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 1;

  return (
    <section style={{ padding: '1.5rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          Cinema Habits & Analytics
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
          Overview of your activity, watched duration, 5-star rating tendencies, and genre preferences.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Watched Movies */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>MOVIES WATCHED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-check" />
            </div>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {watchedList.length}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{wantList.length} in plan to watch</span>
        </div>

        {/* Card 2: Avg User Rating (5-star scale) */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>AVG GIVEN RATING</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-star" />
            </div>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', margin: 0 }}>
            {avgUserRating} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 5 Stars</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{ratingValues.length} total ratings given</span>
        </div>

        {/* Card 3: Watch Time */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>ESTIMATED TIME</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-clock" />
            </div>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8', margin: 0 }}>
            {totalWatchHours} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>hrs</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>~{totalWatchMinutes} total minutes</span>
        </div>

        {/* Card 4: Reviews Logged */}
        <div style={{
          background: 'rgba(18, 24, 38, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>REVIEWS LOGGED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-pen-nib" />
            </div>
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ec4899', margin: 0 }}>
            {Object.keys(reviews).length}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>written movie reviews</span>
        </div>
      </div>

      {/* Genre Distribution Bars */}
      <div style={{
        background: 'rgba(18, 24, 38, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
          Top Collection Genres
        </h3>

        {sortedGenres.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {sortedGenres.map(([genre, count]) => {
              const pct = Math.round((count / maxGenreCount) * 100);
              return (
                <div key={genre}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{genre}</span>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>{count} movie{count > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '10px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                      borderRadius: '5px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>Add movies to your watchlist to calculate genre stats.</p>
        )}
      </div>
    </section>
  );
}
