import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success', // 'success' | 'xp' | 'error'
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    if (type === 'xp') return <Sparkles size={20} color="#06d6a0" />;
    if (type === 'error') return <AlertCircle size={20} color="#ef4444" />;
    return <CheckCircle2 size={20} color="#38bdf8" />;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: 'rgba(20, 30, 54, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 9999,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '400px',
    }}>
      {getIcon()}
      <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, color: '#f8fafc' }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
