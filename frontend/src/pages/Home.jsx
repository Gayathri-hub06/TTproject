import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ShieldCheck, Zap, Activity, Brain, Users, Award, ArrowRight, Volume2 } from 'lucide-react';
import { Button } from '../components/Button';

export const Home = () => {
  const playSampleAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div className="badge badge-teal" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.85rem' }}>
          <ShieldCheck size={14} /> Private & Judgment-Free Speaking Space
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          maxWidth: '900px',
          fontWeight: 800,
        }}>
          Turn Speaking Fear into <span style={{ background: 'linear-gradient(135deg, #06d6a0 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interview Fluency</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
        }}>
          SpeakEasy is your personal speaking coach. We analyze your filler words, speaking pace, and hesitation freezes sentence by sentence — turning speaking anxiety into visible confidence.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register">
            <Button size="lg" icon={<ArrowRight size={18} />}>
              Start Practicing Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Explore Demo Accounts
            </Button>
          </Link>
        </div>

        {/* Live Audio Transformation Demo */}
        <div className="glass-card" style={{
          marginTop: '3.5rem',
          maxWidth: '780px',
          width: '100%',
          textAlign: 'left',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              Real-time Transformation Preview
            </span>
            <span className="badge badge-teal">Live Demonstration</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Student Spoke */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
            }}>
              <span className="badge badge-red" style={{ marginBottom: '0.3rem' }}>You Said (ESL Pattern)</span>
              <p style={{ fontSize: '1rem', color: '#fca5a5', margin: 0 }}>
                "Myself Rahul... um... I am having doubt in asynchronous JavaScript..."
              </p>
            </div>

            {/* SpeakEasy Polished */}
            <div style={{
              background: 'rgba(6, 214, 160, 0.08)',
              border: '1px solid rgba(6, 214, 160, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '0.3rem' }}>Say It Better (Interview Ready)</span>
                <p style={{ fontSize: '1.05rem', color: '#a7f3d0', fontWeight: 600, margin: 0 }}>
                  "My name is Rahul, and I would like to clarify a key concept regarding asynchronous execution in JavaScript."
                </p>
              </div>
              <button
                onClick={() => playSampleAudio("My name is Rahul, and I would like to clarify a key concept regarding asynchronous execution in JavaScript.")}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <Volume2 size={16} /> Listen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section style={{
        padding: '3rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Built for Fear Reduction, Not Just Grammar</h2>
          <p style={{ color: 'var(--text-muted)' }}>Everything you need to step up from classroom silence to interview fluency.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: '1rem',
            }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hesitation Heatmap</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Colors each word by the pause before it. See clearly where you freeze and turn speech hesitation patterns into targeted exercises.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6, 214, 160, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-teal)',
              marginBottom: '1rem',
            }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fear-Adaptive AI Coach</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Measures pre- and post-session anxiety ratings. Difficulty and calming breathing exercises adjust automatically to how nervous you feel.
            </p>
          </div>

          <div className="glass-card">
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
              marginBottom: '1rem',
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Spaced Repetition Drills</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your own speech mistakes resurface automatically at 1, 3, and 7-day intervals until your muscle memory fixes them permanently.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        <p>
          SpeakEasy · A fear-to-fluency speaking coach for students.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
          Built with React (Vite) and Spring Boot REST API, Spring Security, JWT, MySQL, and Web Speech API.
        </p>
      </footer>
    </div>
  );
};
