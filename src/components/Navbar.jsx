import React from 'react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  searchQuery, 
  setSearchQuery, 
  watchlistCount, 
  user, 
  onOpenAuth, 
  onLogout 
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('discover');
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && currentView !== 'discover') {
      setCurrentView('discover');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => {
            setSearchQuery('');
            setCurrentView('discover');
          }}
        >
          <div className="brand-icon">
            <i className="fa-solid fa-film" />
          </div>
          <span className="brand-text">Movie<span>Mate</span></span>
          <span className="brand-badge">v2</span>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="search-container">
          <button 
            type="submit" 
            title="Search Movies"
            style={{
              position: 'absolute',
              left: '0.6rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#e50914',
              cursor: 'pointer',
              fontSize: '0.95rem',
              padding: '4px',
              zIndex: 2
            }}
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>

          <input
            type="text"
            className="search-input"
            placeholder="Search 100+ live movies, actors..."
            value={searchQuery}
            onChange={handleInputChange}
          />

          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1rem',
                zIndex: 2
              }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </form>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          <button
            className={`nav-link ${currentView === 'discover' ? 'active' : ''}`}
            onClick={() => setCurrentView('discover')}
          >
            <i className="fa-solid fa-compass" />
            <span>Discover</span>
          </button>

          <button
            className={`nav-link ${currentView === 'watchlist' ? 'active' : ''}`}
            onClick={() => setCurrentView('watchlist')}
            style={{ position: 'relative' }}
          >
            <i className="fa-solid fa-bookmark" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="badge-count">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            className={`nav-link ${currentView === 'recommendations' ? 'active' : ''}`}
            onClick={() => setCurrentView('recommendations')}
          >
            <i className="fa-solid fa-wand-magic-sparkles" />
            <span>For You</span>
          </button>

          <button
            className={`nav-link ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <i className="fa-solid fa-chart-pie" />
            <span>Stats</span>
          </button>

          {/* Admin Dashboard Tab (if Admin User) */}
          {user?.role === 'admin' && (
            <button
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
              style={{
                background: currentView === 'admin' ? 'linear-gradient(135deg, #e50914, #991b1b)' : 'rgba(229, 9, 20, 0.15)',
                color: currentView === 'admin' ? '#fff' : '#f87171',
                border: '1px solid rgba(229, 9, 20, 0.4)'
              }}
            >
              <i className="fa-solid fa-user-shield" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: '0.5rem' }}>
              <div style={{
                background: 'rgba(229, 9, 20, 0.15)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <i className={`fa-solid ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`} />
                {user.name}
              </div>

              <button
                className="nav-link icon-only"
                onClick={onLogout}
                title="Logout"
                style={{ color: '#ef4444' }}
              >
                <i className="fa-solid fa-right-from-bracket" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onOpenAuth}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', marginLeft: '0.5rem' }}
            >
              <i className="fa-solid fa-right-to-bracket" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
