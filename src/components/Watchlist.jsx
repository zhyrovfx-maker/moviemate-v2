import React, { useState } from 'react';

export default function Watchlist({ 
  watchlist, 
  onToggleWatchlist, 
  onSelectMovie 
}) {
  const [activeTab, setActiveTab] = useState('want'); // 'want' | 'watched'

  const filteredList = watchlist.filter(item => (item.status || 'want') === activeTab);

  return (
    <section style={{ padding: '1.5rem 0' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Your Watchlist & Saved Movies
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            Keep track of movies you plan to see or have already watched.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '1rem',
        marginBottom: '1.75rem'
      }}>
        <button
          onClick={() => setActiveTab('want')}
          style={{
            background: activeTab === 'want' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            border: activeTab === 'want' ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
            color: activeTab === 'want' ? '#818cf8' : '#94a3b8',
            padding: '0.6rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-bookmark" /> Want to Watch ({watchlist.filter(i => (i.status || 'want') === 'want').length})
        </button>

        <button
          onClick={() => setActiveTab('watched')}
          style={{
            background: activeTab === 'watched' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: activeTab === 'watched' ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
            color: activeTab === 'watched' ? '#34d399' : '#94a3b8',
            padding: '0.6rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-circle-check" /> Already Watched ({watchlist.filter(i => i.status === 'watched').length})
        </button>
      </div>

      {/* Grid of Watchlist Items */}
      {filteredList.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredList.map(item => (
            <div 
              key={item.id}
              style={{
                background: 'rgba(18, 24, 38, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img 
                src={item.poster_path} 
                alt={item.title}
                onClick={() => onSelectMovie(item)}
                style={{ width: '100%', height: '240px', objectFit: 'cover', cursor: 'pointer' }} 
              />
              <div style={{ padding: '0.85rem' }}>
                <h4 
                  onClick={() => onSelectMovie(item)}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.4rem'
                  }}
                >
                  {item.title}
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {/* Status Toggle */}
                  <button
                    onClick={() => onToggleWatchlist(item, activeTab === 'want' ? 'watched' : 'want')}
                    style={{
                      background: activeTab === 'want' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: activeTab === 'want' ? '#34d399' : '#818cf8',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {activeTab === 'want' ? 'Mark Watched' : 'Move to Want'}
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => onToggleWatchlist(item, activeTab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                    title="Remove from list"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Watchlist State */
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(18, 24, 38, 0.5)',
          borderRadius: '20px',
          border: '1px dashed rgba(255, 255, 255, 0.1)'
        }}>
          <i className="fa-solid fa-bookmark" style={{ fontSize: '3rem', color: '#64748b', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '0.5rem' }}>Your Watchlist is Empty</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Explore movies in the Discover tab and click the bookmark button to save them here!
          </p>
        </div>
      )}
    </section>
  );
}
