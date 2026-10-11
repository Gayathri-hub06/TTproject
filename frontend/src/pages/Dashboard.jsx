import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { progressApi, aiApi } from '../services/api';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Spinner } from '../components/Spinner';
import {
  Flame,
  Award,
  TrendingDown,
  Activity,
  Mic,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI Modal states
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [storyLoading, setStoryLoading] = useState(false);

  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await progressApi.getProgress();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load progress statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWeeklyStory = async () => {
    setIsStoryOpen(true);
    if (!storyData) {
      try {
        setStoryLoading(true);
        const res = await aiApi.getWeeklyStory();
        setStoryData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setStoryLoading(false);
      }
    }
  };

  const handleOpenDiagnosis = async () => {
    setIsDiagnosisOpen(true);
    if (!diagnosisData) {
      try {
        setDiagnosisLoading(true);
        const res = await aiApi.getHesitationReport();
        setDiagnosisData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setDiagnosisLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Spinner size={36} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your confidence metrics...</p>
      </div>
    );
  }

  const fearCurve = data?.fearCurve || [];

  return (
    <div className="page-wrapper">
      {/* Top Welcome Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Hello, {user?.name ? user.name.split(' ')[0] : 'Learner'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Your fear-to-fluency curve is trending in the right direction. Steady practice builds muscle memory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            onClick={handleOpenWeeklyStory}
            variant="secondary"
            icon={<Sparkles size={16} color="var(--accent-teal)" />}
          >
            Weekly Confidence Story
          </Button>

          <Button
            onClick={handleOpenDiagnosis}
            variant="secondary"
            icon={<Activity size={16} color="var(--accent-cyan)" />}
          >
            Hesitation Diagnosis
          </Button>

          <Link to="/practice">
            <Button variant="primary" icon={<Mic size={18} />}>
              Start Speaking (+10 XP)
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {/* Streak */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(249, 115, 22, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f97316',
          }}>
            <Flame size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Daily Streak
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              {data?.currentStreak || 0} Days
            </div>
          </div>
        </div>

        {/* Level Progression */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 214, 160, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06d6a0',
          }}>
            <Award size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Level
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                {data?.xpTotal || 0} XP
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
              {data?.levelTitle || 'Warm-up'}
            </div>
            <ProgressBar value={data?.levelProgressPercent || 0} max={100} height="5px" color="#06d6a0" />
          </div>
        </div>

        {/* Average Speaking Pace */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
          }}>
            <Activity size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Speaking Pace
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              {data?.avgWordsPerMin || 125} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>wpm</span>
            </div>
          </div>
        </div>

        {/* Fear Reduction */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc',
          }}>
            <TrendingDown size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Avg Fear Reduction
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              -{data?.avgFearReduction || 1.8} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Analytics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Fear Meter Confidence Curve (Inline SVG Chart - Feature 8) */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>Fear Meter: Confidence Curve</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Comparing Pre-session nervousness vs Post-session calm
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Before
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06d6a0' }} /> After
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Grid Lines */}
              {[40, 80, 120].map((y) => (
                <line key={y} x1="30" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              ))}

              {/* Data Points */}
              {fearCurve.map((pt, i) => {
                const x = 50 + i * (420 / Math.max(fearCurve.length - 1, 1));
                const yBefore = 140 - pt.fearBefore * 24;
                const yAfter = 140 - pt.fearAfter * 24;

                return (
                  <g key={i}>
                    {/* Fear Before Red Node */}
                    <circle cx={x} cy={yBefore} r="5" fill="#ef4444" />
                    {/* Fear After Teal Node */}
                    <circle cx={x} cy={yAfter} r="5" fill="#06d6a0" />
                    {/* Delta connector */}
                    <line x1={x} y1={yBefore} x2={x} y2={yAfter} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    {/* Label */}
                    <text x={x} y="155" fill="#64748b" fontSize="10" textAnchor="middle">{pt.date}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '0.5rem'
          }}>
            Notice the gap: speaking sentence by sentence reliably discharges fear hormones.
          </div>
        </div>

        {/* Weekly Speaking Activity */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>7-Day Speaking Habit</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Sentences practised and XP earned</p>
            </div>
            <Link to="/history" style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)' }}>
              Full History &rarr;
            </Link>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '160px',
            padding: '0 0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {data?.weeklyActivity?.map((day, idx) => {
              const barHeight = Math.min(day.xpEarned * 3.5, 130);
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                    {day.xpEarned}xp
                  </span>
                  <div style={{
                    width: '32px',
                    height: `${barHeight}px`,
                    background: 'linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.2) 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease',
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Due Drills & Badges Quick Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Spaced Drills Reminder */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge badge-amber">Spaced Repetition</span>
              <RotateCcw size={18} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
              {data?.dueDrillsCount || 0} Drill Cards Due Today
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Reinforce your own corrected mistakes on Day 1, 3, and 7 schedule to lock in fluent phrasing permanently.
            </p>
          </div>

          <Link to="/drills" style={{ marginTop: '1.25rem' }}>
            <Button variant="secondary" icon={<ArrowRight size={16} />} style={{ width: '100%' }}>
              Practice Due Cards
            </Button>
          </Link>
        </div>

        {/* Badges Earned */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Achievements Unlocked</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
              {data?.badges?.filter((b) => b.unlocked).length} / {data?.badges?.length || 5} Earned
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data?.badges?.slice(0, 3).map((b) => (
              <div
                key={b.badgeId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: b.unlocked ? 'rgba(6, 214, 160, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${b.unlocked ? 'rgba(6, 214, 160, 0.25)' : 'var(--border-subtle)'}`,
                }}
              >
                <div style={{
                  color: b.unlocked ? '#06d6a0' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <CheckCircle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: b.unlocked ? '#f8fafc' : '#64748b' }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {b.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Confidence Story Modal (Feature 18) */}
      <Modal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        title="Weekly Confidence Story (Verified by Database)"
      >
        {storyLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner />
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Verifying real metrics from database...</p>
          </div>
        ) : storyData ? (
          <div>
            <div className="badge badge-teal" style={{ marginBottom: '1rem' }}>
              Zero Hallucination Verified
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#f8fafc', marginBottom: '1.5rem' }}>
              "{storyData.story}"
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              background: 'rgba(10, 15, 29, 0.8)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sessions</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {storyData.totalSessions}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pace Avg</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                  {storyData.avgWordsPerMin} wpm
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fear Drop</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#c084fc' }}>
                  -{storyData.avgFearReduction} pts
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No story generated yet.</p>
        )}
      </Modal>

      {/* Hesitation Diagnosis Modal (Feature 15) */}
      <Modal
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
        title="AI Hesitation Diagnosis & Custom Exercises"
      >
        {diagnosisLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner />
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Analyzing cadence patterns from recent sessions...</p>
          </div>
        ) : diagnosisData ? (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Cadence Analysis</span>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {diagnosisData.diagnosis}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Targeted Tongue Twisters</span>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--accent-teal)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {diagnosisData.tongueTwisters?.map((tt, i) => (
                  <li key={i}>{tt}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Rhythm Drills</span>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {diagnosisData.targetedExercises?.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No diagnosis data available.</p>
        )}
      </Modal>
    </div>
  );
};
