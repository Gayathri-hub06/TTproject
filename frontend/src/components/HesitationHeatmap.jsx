import React from 'react';

export const HesitationHeatmap = ({ wordPauses = [] }) => {
  if (!wordPauses || wordPauses.length === 0) {
    return (
      <div style={{ color: 'var(--text-dim)', fontSize: '0.875rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
        Speak a sentence to see live hesitation coloring...
      </div>
    );
  }

  const getPauseClass = (sec) => {
    if (sec >= 1.5) return 'pause-red';
    if (sec >= 0.5) return 'pause-amber';
    return 'pause-green';
  };

  return (
    <div>
      <div className="heatmap-box">
        {wordPauses.map((item, idx) => {
          const pauseClass = getPauseClass(item.pauseSeconds);
          return (
            <span
              key={idx}
              className={`word-tag ${pauseClass}`}
              title={`Word: "${item.word}" · Pause before word: ${item.pauseSeconds}s`}
            >
              {item.word}
              {item.pauseSeconds > 0.8 && (
                <span style={{ fontSize: '0.65rem', marginLeft: '3px', opacity: 0.8 }}>
                  ({item.pauseSeconds}s)
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06d6a0' }} />
          Smooth (&lt;0.5s)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f59e0b' }} />
          Hesitation (0.5s–1.5s)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }} />
          Freeze (&gt;1.5s)
        </div>
      </div>
    </div>
  );
};
