import React, { useState } from 'react';
import { storage } from '../services/storage';

export default function SettingsModal({ onClose, onSaveSettings }) {
  const initialSettings = storage.getSettings();
  const [apiKey, setApiKey] = useState(initialSettings.tmdbApiKey || '');
  const [useLiveApi, setUseLiveApi] = useState(Boolean(initialSettings.useLiveApi));

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      tmdbApiKey: apiKey.trim(),
      useLiveApi: Boolean(apiKey.trim() && useLiveApi)
    };
    storage.saveSettings(updated);
    onSaveSettings(updated);
    onClose();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to reset all watchlist, rating, and review data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            <i className="fa-solid fa-gear" style={{ color: '#6366f1', marginRight: '8px' }} />
            MovieMate Settings
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TMDB API Key Configuration */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem' }}>
              TMDB API Key (v3)
            </label>
            <input
              type="text"
              placeholder="e.g. 1a2b3c4d5e..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(18, 24, 38, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none',
                marginBottom: '0.5rem'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Entering a free TMDB API key unlocks live search for any film globally. If left empty, MovieMate v2 operates using its high-res offline catalog.
            </p>
          </div>

          {/* Live API Checkbox */}
          {apiKey.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="useLiveApi"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="useLiveApi" style={{ fontSize: '0.9rem', color: '#f8fafc', cursor: 'pointer' }}>
                Enable Live TMDB API Requests
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Save Configuration
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>

        {/* Danger Zone: Reset Data */}
        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h5 style={{ color: '#ef4444', margin: 0, fontSize: '0.9rem' }}>Reset Local Storage</h5>
            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Clears all saved watchlists, ratings, and reviews.</p>
          </div>
          <button 
            onClick={handleClearData}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Data
          </button>
        </div>
      </div>
    </div>
  );
}
