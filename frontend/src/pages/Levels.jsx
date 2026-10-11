import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Award, Lock, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const Levels = () => {
  const { user } = useAuth();
  const xp = user?.xpTotal || 0;

  const levels = [
    {
      levelId: 1,
      title: 'Warm-up',
      xpRequired: 0,
      description: 'Read a sentence aloud with natural pacing and clarity.',
      activity: 'Speaking 1 to 2 sentences cleanly with fewer than 2 filler words per minute.',
      badgeColor: '#38bdf8',
    },
    {
      levelId: 2,
      title: 'Describe',
      xpRequired: 200,
      description: 'Talk about a picture or a simple question for 30 seconds.',
      activity: 'Organizing thoughts spontaneously without long pause freezes.',
      badgeColor: '#06d6a0',
    },
    {
      levelId: 3,
      title: 'One Minute',
      xpRequired: 500,
      description: 'Speak on a structured topic for a full sixty seconds without freezing.',
      activity: 'Sustained speaking on current events or engineering concepts.',
      badgeColor: '#f59e0b',
    },
    {
      levelId: 4,
      title: 'Mock HR',
      xpRequired: 1000,
      description: 'Answer standard interview questions with structured behavioral framing (STAR method).',
      activity: 'Direct rehearsal for campus placements and technical screening rounds.',
      badgeColor: '#8b5cf6',
    },
    {
      levelId: 5,
      title: 'Group Talk',
      xpRequired: 2000,
      description: 'Respond assertively in simulated panel and group discussion pressure environments.',
      activity: 'High-pressure cross-examination and rebuttal skills.',
      badgeColor: '#ec4899',
    },
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: '880px' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <Award size={14} /> Fear-to-Fluency Progression Path
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Level Ladder</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Every sentence you speak earns XP. As you climb from basic warm-ups to high-pressure mock interviews, your muscle memory and executive presence grow.
        </p>
      </div>

      {/* User Progress Spotlight Card */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.75rem', border: '1px solid rgba(6, 214, 160, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Standing
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              Level {user?.levelId || 1} · {user?.levelTitle || 'Warm-up'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 700 }}>
              {xp} Total Experience Points (XP)
            </span>
          </div>
        </div>

        <ProgressBar
          value={xp}
          max={2000}
          height="10px"
          label="Road to Group Talk Fluency (2000 XP)"
          subLabel={`${Math.round((xp / 2000) * 100)}% Complete`}
        />
      </div>

      {/* Ladder Step Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {levels.map((lvl) => {
          const isUnlocked = xp >= lvl.xpRequired;
          const isCurrent = user?.levelId === lvl.levelId || (user?.levelTitle === lvl.title);

          return (
            <div
              key={lvl.levelId}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                border: isCurrent
                  ? '2px solid var(--accent-teal)'
                  : isUnlocked
                  ? '1px solid rgba(255, 255, 255, 0.15)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                opacity: isUnlocked ? 1 : 0.6,
                position: 'relative',
              }}
            >
              {/* Badge Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: isUnlocked ? `${lvl.badgeColor}20` : 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isUnlocked ? lvl.badgeColor : '#64748b',
                flexShrink: 0,
              }}>
                {isUnlocked ? <Award size={30} /> : <Lock size={26} />}
              </div>

              {/* Text Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                    Level {lvl.levelId}: {lvl.title}
                  </h3>
                  {isCurrent && <span className="badge badge-teal">Current Level</span>}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({lvl.xpRequired} XP required)
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {lvl.description}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
                  <strong>Practice Focus:</strong> {lvl.activity}
                </p>
              </div>

              {/* Action Button */}
              {isUnlocked && (
                <Link to="/practice">
                  <Button variant="secondary" size="sm" icon={<Zap size={14} />}>
                    Practice
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
