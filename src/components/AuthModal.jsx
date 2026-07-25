import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (activeTab === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      const res = await apiClient.register(name, email, password);
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    } else {
      const isAdmin = activeTab === 'admin';
      const res = await apiClient.login(email, password, isAdmin);
      if (res.success) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
    setLoading(false);
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@moviemate.com');
      setPassword('admin123');
      setActiveTab('admin');
    } else {
      setEmail('user@moviemate.com');
      setPassword('user123');
      setActiveTab('login');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 10, 18, 0.88)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '2.25rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        position: 'relative',
        animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#94a3b8',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Tab Headers */}
        <div style={{
          display: 'flex',
          background: 'rgba(18, 24, 38, 0.8)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.75rem'
        }}>
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'login' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: activeTab === 'login' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            User Login
          </button>

          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'register' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: activeTab === 'register' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Register
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'admin' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
              color: activeTab === 'admin' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-user-shield" style={{ marginRight: '4px' }} /> Admin
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {activeTab === 'register' ? 'Create Account' : activeTab === 'admin' ? 'Admin Authentication' : 'Welcome Back'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {activeTab === 'register' ? 'Join MovieMate v2 to save your ratings & watchlist.' : activeTab === 'admin' ? 'Access administrative controls & movie manager.' : 'Sign in to sync your personalized cinema collection.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
                FULL NAME
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(18, 24, 38, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="e.g. user@moviemate.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(18, 24, 38, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(18, 24, 38, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-primary'}`}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : activeTab === 'register' ? 'Create Account' : activeTab === 'admin' ? 'Login as Administrator' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>Instant 1-Click Demo Login:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickDemo('user')}
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Demo User
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              style={{
                background: 'rgba(236, 72, 153, 0.12)',
                color: '#f472b6',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
