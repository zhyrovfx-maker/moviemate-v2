import React from 'react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      background: 'rgba(18, 24, 38, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)',
      padding: '1rem 1.4rem',
      borderRadius: '14px',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.95rem',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '0.85rem'
      }}>
        <i className={toast.type === 'watchlist' ? 'fa-solid fa-bookmark' : toast.type === 'rating' ? 'fa-solid fa-star' : 'fa-solid fa-circle-check'} />
      </div>
      <div>
        <p style={{ fontWeight: 600, margin: 0 }}>{toast.title}</p>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          fontSize: '1rem',
          padding: '4px'
        }}
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
