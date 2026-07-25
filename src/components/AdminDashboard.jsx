import React, { useState } from 'react';
import { tmdbApi } from '../services/tmdbApi';

export default function AdminDashboard({ movies, onAddMovie, onDeleteMovie, user }) {
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'movies' | 'users'
  const [importQuery, setImportQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [importNotice, setImportNotice] = useState('');

  // Manual Movie Form State
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newGenres, setNewGenres] = useState('Sci-Fi, Action');
  const [newOverview, setNewOverview] = useState('');
  const [newPoster, setNewPoster] = useState('');
  const [newBackdrop, setNewBackdrop] = useState('');
  const [newTrailer, setNewTrailer] = useState('');

  const handleSearchTMDB = async (e) => {
    e.preventDefault();
    if (!importQuery.trim()) return;
    setSearching(true);
    const results = await tmdbApi.searchMovies(importQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const handleImportTMDBMovie = async (movie) => {
    const details = await tmdbApi.getMovieDetails(movie.id);
    onAddMovie(details);
    setImportNotice(`Successfully imported "${details.title}" into catalog!`);
    setTimeout(() => setImportNotice(''), 4000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const movieObj = {
      id: Date.now(),
      title: newTitle.trim(),
      year: newYear,
      release_date: `${newYear}-01-01`,
      genres: newGenres.split(',').map(g => g.trim()),
      overview: newOverview.trim() || 'Custom movie entry.',
      poster_path: newPoster.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      backdrop_path: newBackdrop.trim() || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      vote_average: 8.0,
      vote_count: 1,
      youtube_trailer_id: newTrailer.trim() || null,
      runtime: 120,
      director: 'Admin Created'
    };

    onAddMovie(movieObj);
    setNewTitle('');
    setNewOverview('');
    setNewPoster('');
    setNewBackdrop('');
    setNewTrailer('');
    setImportNotice(`Added "${movieObj.title}" to catalog!`);
    setTimeout(() => setImportNotice(''), 4000);
  };

  return (
    <section style={{ padding: '1.5rem 0' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(99, 102, 241, 0.15))',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <i className="fa-solid fa-user-shield" /> Administrator Portal
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            MovieMate v2 Control Panel
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Import films directly from TMDB server API, add custom titles, and manage database records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(18, 24, 38, 0.8)', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>TOTAL MOVIES</span>
            <strong style={{ fontSize: '1.2rem', color: '#f8fafc' }}>{movies.length}</strong>
          </div>
          <div style={{ background: 'rgba(18, 24, 38, 0.8)', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>ADMIN LOGGED IN</span>
            <strong style={{ fontSize: '1.1rem', color: '#ec4899' }}>{user?.name || 'Admin'}</strong>
          </div>
        </div>
      </div>

      {importNotice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '0.85rem 1.25rem',
          borderRadius: '14px',
          fontWeight: 600,
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="fa-solid fa-circle-check" /> {importNotice}
        </div>
      )}

      {/* Admin Tab Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('import')}
          className={`btn ${activeTab === 'import' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem' }}
        >
          <i className="fa-solid fa-cloud-arrow-down" /> TMDB 1-Click Auto Import
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem' }}
        >
          <i className="fa-solid fa-plus" /> Add Custom Movie
        </button>

        <button
          onClick={() => setActiveTab('movies')}
          className={`btn ${activeTab === 'movies' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem' }}
        >
          <i className="fa-solid fa-film" /> Manage Movies ({movies.length})
        </button>
      </div>

      {/* 1. TMDB Auto Import Tab */}
      {activeTab === 'import' && (
        <div style={{ background: 'rgba(18, 24, 38, 0.85)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Search & Import Movies from TMDB Global Database
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Type any film title to query TMDB server-side. Click "Import Movie" to automatically ingest high-res posters, trailers, overview, cast, and metadata.
          </p>

          <form onSubmit={handleSearchTMDB} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Search movie title (e.g. Gladiator II, Deadpool, Avatar)..."
              value={importQuery}
              onChange={(e) => setImportQuery(e.target.value)}
              style={{
                flex: 1,
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <i className="fa-solid fa-magnifying-glass" /> Search TMDB
            </button>
          </form>

          {searching && <p style={{ color: '#818cf8' }}>Searching TMDB server API...</p>}

          {searchResults.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {searchResults.map(movie => (
                <div key={movie.id} style={{ background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={movie.poster_path} alt={movie.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>{movie.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{movie.year} • ★ {movie.vote_average}</span>
                    </div>
                    <button
                      onClick={() => handleImportTMDBMovie(movie)}
                      className="btn btn-primary"
                      style={{ marginTop: '0.85rem', padding: '0.45rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-download" /> Import Movie
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Custom Movie Creation Tab */}
      {activeTab === 'create' && (
        <div style={{ background: 'rgba(18, 24, 38, 0.85)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
            Add Custom Movie Entry
          </h3>
          <form onSubmit={handleManualAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem' }}>MOVIE TITLE</label>
              <input type="text" required placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.7rem', color: '#fff' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem' }}>RELEASE YEAR</label>
              <input type="text" placeholder="2024" value={newYear} onChange={(e) => setNewYear(e.target.value)} style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.7rem', color: '#fff' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem' }}>GENRES (comma separated)</label>
              <input type="text" placeholder="Sci-Fi, Action, Drama" value={newGenres} onChange={(e) => setNewGenres(e.target.value)} style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.7rem', color: '#fff' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem' }}>POSTER IMAGE URL</label>
              <input type="text" placeholder="https://..." value={newPoster} onChange={(e) => setNewPoster(e.target.value)} style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.7rem', color: '#fff' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.35rem' }}>SYNOPSIS / OVERVIEW</label>
              <textarea rows="3" placeholder="Movie synopsis..." value={newOverview} onChange={(e) => setNewOverview(e.target.value)} style={{ width: '100%', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.7rem', color: '#fff' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                <i className="fa-solid fa-plus" /> Save Movie to Catalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Movie Catalog Management Tab */}
      {activeTab === 'movies' && (
        <div style={{ background: 'rgba(18, 24, 38, 0.85)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
            Catalog Movie List ({movies.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {movies.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={m.poster_path} alt={m.title} style={{ width: '45px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '0.95rem' }}>{m.title}</h4>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{m.year} • {m.genres?.join(', ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMovie(m.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <i className="fa-solid fa-trash" /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
