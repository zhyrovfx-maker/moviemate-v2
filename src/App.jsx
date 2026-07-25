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
import { MOCK_MOVIES } from './data/mockMovies';

export default function App() {
  const [currentView, setCurrentView] = useState('discover'); // 'discover' | 'watchlist' | 'recommendations' | 'analytics' | 'admin'
  // Initialize with instant offline catalog so mobile users ALWAYS see movies instantly
  const [movies, setMovies] = useState(() => MOCK_MOVIES.map(tmdbApi.formatMovie));
  const [loading, setLoading] = useState(false);
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

  // Fetch Live TMDB Movies & Merge
  useEffect(() => {
    let active = true;
    async function fetchMovies() {
      try {
        let results = [];
        if (searchQuery.trim()) {
          results = await tmdbApi.searchMovies(searchQuery);
        } else {
          results = await tmdbApi.getTrending();
        }
        if (active && results && results.length > 0) {
          setMovies(results);
        }
      } catch (err) {
        console.warn('Live fetch error:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMovies();
    return () => { active = false; };
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

  // Sort Movies for Grid
  const sortedMovies = useMemo(() => {
    let list = [...movies];

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
  }, [movies, sortBy]);

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
    triggerToast('rating', 'Rating Saved', `You rated "${movieTitle}" ${rating}/5 stars.`);
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
    if (currentView === 'admin') setCurrentView('discover');
    triggerToast('auth', 'Logged Out', 'You have been signed out.');
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(authenticatedUser) => {
            setUser(authenticatedUser);
            triggerToast('auth', 'Welcome!', `Signed in as ${authenticatedUser.name}`);
          }}
        />
      )}

      {/* Global Glassmorphic Navbar */}
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
            {/* Hero Banner for Featured Film */}
            {!searchQuery && featuredMovie && (
              <HeroBanner
                movie={featuredMovie}
                onSelectMovie={setSelectedMovie}
                onToggleWatchlist={handleToggleWatchlist}
                inWatchlist={watchlist.some(item => item.id === featuredMovie.id)}
              />
            )}

            {/* Movie Catalog Grid */}
            <MovieGrid
              movies={sortedMovies}
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
          />
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
          inWatchlist={watchlist.some(item => item.id === selectedMovie.id)}
          userRating={ratings[selectedMovie.id]?.rating}
          onSetRating={handleSetRating}
          userReviews={reviews}
          onAddReview={handleAddReview}
          onSelectMovie={setSelectedMovie}
        />
      )}
    </div>
  );
}
