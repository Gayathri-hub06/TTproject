import React, { useState, useEffect } from 'react';

export const BreathingCircle = ({ pattern = 'Box Breathing: 4s Inhale, 4s Hold, 4s Exhale' }) => {
  const [phase, setPhase] = useState('Inhale');

  useEffect(() => {
    const cycle = ['Inhale...', 'Hold...', 'Exhale...', 'Rest...'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % cycle.length;
      setPhase(cycle[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="breathing-container">
      <div className="breathing-circle-outer">
        <div className="breathing-circle-inner">
          {phase}
        </div>
      </div>
      <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
        {pattern}
      </p>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Follow the circle rhythm to steady your heart rate and release adrenaline.
      </span>
    </div>
  );
};
