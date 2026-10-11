import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label = null,
  subLabel = null,
  color = 'var(--accent-teal)',
  height = '8px',
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div style={{ width: '100%', marginBottom: '0.75rem' }}>
      {(label || subLabel) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem',
          fontSize: '0.8125rem',
        }}>
          {label && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>}
          {subLabel && <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{subLabel}</span>}
        </div>
      )}

      <div style={{
        width: '100%',
        height,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '9999px',
          transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  );
};
