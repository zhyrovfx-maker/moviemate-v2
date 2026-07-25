import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import Watchlist from './components/Watchlist';
import Recommendations from './components/Recommendations';
import Analytics from './components/Analytics';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import NotificationToast from './components/NotificationToast';
import { tmdbApi } from './services/tmdbApi';
import { storage } from './services/storage';
import { apiClient } from './services/apiClient';

export default function App() {
  const [currentView, setCurrentView] = useState('discover'); // 'discover' | 'watchlist' | 'recommendations' | 'analytics' | 'admin'
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(() => apiClient.getUser());
  const [toast, setToast] = useState(null);

  // Local Storage State
  const [watchlist, setWatchlist] = useState(() => storage.getWatchlist());
  const [ratings, setRatings] = useState(() => storage.getRatings());
  const [reviews, setReviews] = useState(() => storage.getReviews());

  // Show Toast Helper
  const triggerToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch Movies (Server TMDB proxy + local cache)
  useEffect(() => {
    let active = true;
    async function fetchMovies() {
      setLoading(true);
      let results = [];
      if (searchQuery.trim()) {
        results = await tmdbApi.searchMovies(searchQuery);
      } else {
        results = await tmdbApi.getTrending();
      }
      if (active) {
        setMovies(results);
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Admin movie addition handler
  const handleAddMovieToCatalog = (newMovie) => {
    setMovies(prev => [newMovie, ...prev]);
    triggerToast('admin', 'Catalog Updated', `Added "${newMovie.title}" to movie database.`);
  };

  // Admin movie deletion handler
  const handleDeleteMovieFromCatalog = (movieId) => {
    setMovies(prev => prev.filter(m => m.id !== movieId));
    triggerToast('admin', 'Movie Deleted', 'Removed movie from database.');
  };

  // Featured Movie for Hero Banner
  const featuredMovie = useMemo(() => {
    return movies.find(m => m.featured) || movies[0] || null;
  }, [movies]);

  // Filter & Sort Movies for Grid
  const processedMovies = useMemo(() => {
    let list = [...movies];

    if (selectedGenre !== 'all') {
      list = list.filter(m => 
        m.genres && m.genres.some(g => g.toLowerCase().includes(selectedGenre.toLowerCase()))
      );
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.release_date || '2024') - new Date(a.release_date || '2024'));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }

    return list;
  }, [movies, selectedGenre, sortBy]);

  // Toggle Watchlist Handler
  const handleToggleWatchlist = (movie, targetStatus = 'want') => {
    const updated = storage.toggleWatchlist(movie, targetStatus);
    setWatchlist(updated);

    const isAdded = updated.some(item => item.id === movie.id);
    if (isAdded) {
      triggerToast('watchlist', 'Watchlist Updated', `Saved "${movie.title}" to your list.`);
    } else {
      triggerToast('watchlist', 'Removed from List', `Removed "${movie.title}".`);
    }
  };

  // Set User Rating Handler
  const handleSetRating = (movieId, rating) => {
    const updated = storage.setRating(movieId, rating);
    setRatings(updated);
    const movieObj = movies.find(m => m.id === movieId);
    const movieTitle = movieObj ? movieObj.title : 'Movie';
    triggerToast('rating', 'Rating Saved', `You rated "${movieTitle}" ${rating}/10 stars.`);
  };

  // Add User Review Handler
  const handleAddReview = (movieId, text) => {
    const userName = user ? user.name : 'You';
    const updated = storage.addReview(movieId, text, userName);
    setReviews(updated);
    triggerToast('review', 'Review Published', 'Your review has been logged.');
  };

  const handleLogout = async () => {
    await apiClient.logout();
    setUser(null);
    setCurrentView('discover');
    triggerToast('auth', 'Signed Out', 'You have been logged out.');
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        watchlistCount={watchlist.length}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'discover' && (
          <>
            {/* Hero Spotlight Banner */}
            {!searchQuery && (
              <HeroBanner
                movie={featuredMovie}
                onSelectMovie={setSelectedMovie}
                onToggleWatchlist={handleToggleWatchlist}
                inWatchlist={featuredMovie ? watchlist.some(w => w.id === featuredMovie.id) : false}
              />
            )}

            {/* Discover Movie Grid */}
            <MovieGrid
              movies={processedMovies}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSelectMovie={setSelectedMovie}
              onToggleWatchlist={handleToggleWatchlist}
              watchlist={watchlist}
              ratings={ratings}
            />
          </>
        )}

        {currentView === 'watchlist' && (
          <Watchlist
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectMovie={setSelectedMovie}
            onRefreshWatchlist={() => setWatchlist(storage.getWatchlist())}
          />
        )}

        {currentView === 'recommendations' && (
          <Recommendations
            movies={movies}
            watchlist={watchlist}
            ratings={ratings}
            onSelectMovie={setSelectedMovie}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {currentView === 'analytics' && (
          <Analytics
            watchlist={watchlist}
            ratings={ratings}
            reviews={reviews}
            movies={movies}
          />
        )}

        {currentView === 'admin' && user?.role === 'admin' && (
          <AdminDashboard
            movies={movies}
            onAddMovie={handleAddMovieToCatalog}
            onDeleteMovie={handleDeleteMovieFromCatalog}
            user={user}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#64748b',
        fontSize: '0.85rem',
        marginTop: '3rem'
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          MovieMate v2 — Open Source Cinema Platform & Admin Manager
        </p>
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#475569' }}>
          Server-side TMDB Integration • PHP API & MySQL Ready • Role-based Auth
        </p>
      </footer>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
          inWatchlist={watchlist.some(w => w.id === selectedMovie.id)}
          userRating={ratings[selectedMovie.id]?.rating}
          onSetRating={handleSetRating}
          userReviews={reviews}
          onAddReview={handleAddReview}
          onSelectMovie={setSelectedMovie}
        />
      )}

      {/* Auth Modal (Login / Register / Admin) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(authUser) => {
            setUser(authUser);
            if (authUser.role === 'admin') {
              setCurrentView('admin');
              triggerToast('auth', 'Welcome Administrator', `Logged in as ${authUser.name}`);
            } else {
              triggerToast('auth', 'Welcome Back', `Logged in as ${authUser.name}`);
            }
          }}
        />
      )}

      {/* Toast Notification */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
