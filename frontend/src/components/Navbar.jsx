import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Flame, Award, LogOut, User as UserIcon, Mic } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '68px',
      background: 'rgba(10, 15, 29, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand */}
      <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06d6a0 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(6, 214, 160, 0.4)',
        }}>
          <Mic size={20} color="#04271d" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SpeakEasy
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '-3px' }}>
            Fear to Fluency
          </span>
        </div>
      </Link>

      {/* Auth Stats & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {isAuthenticated && user ? (
          <>
            {/* Streak Counter */}
            <div
              className="streak-flame"
              title={`${user.currentStreak || 0} Day Active Streak`}
              style={{ fontSize: '0.9rem', cursor: 'default' }}
            >
              <Flame size={18} />
              <span>{user.currentStreak || 0}d</span>
            </div>

            {/* Level Badge */}
            <Link
              to="/levels"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
              title="Click to view Level Ladder"
            >
              <span className="badge badge-teal" style={{ cursor: 'pointer' }}>
                <Award size={13} />
                {user.levelTitle || 'Warm-up'}
              </span>
            </Link>

            {/* XP Points */}
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              {user.xpTotal || 0} XP
            </div>

            {/* User Profile Tag */}
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                <UserIcon size={16} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'none', md: 'inline' }}>
                {user.name ? user.name.split(' ')[0] : 'User'}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              title="Log out"
              style={{ padding: '0.4rem 0.6rem', color: 'var(--text-muted)' }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
