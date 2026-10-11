import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Mic,
  History,
  RotateCcw,
  Users,
  Award,
  GraduationCap,
  HelpCircle,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const { role } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/practice', label: 'Practice Arena', icon: <Mic size={19} /> },
    { to: '/history', label: 'History & Analytics', icon: <History size={19} /> },
    { to: '/drills', label: 'Mistake Drills', icon: <RotateCcw size={19} /> },
    { to: '/interview', label: 'Mock Interview', icon: <Users size={19} /> },
    { to: '/levels', label: 'Level Ladder', icon: <Award size={19} /> },
    { to: '/classes', label: role === 'TEACHER' ? 'My Classes' : 'Classrooms', icon: <GraduationCap size={19} /> },
  ];

  // Admin Question Bank
  if (role === 'ADMIN') {
    navItems.push({
      to: '/admin/questions',
      label: 'Question Bank',
      icon: <HelpCircle size={19} />,
      badge: 'Admin',
    });
  }

  navItems.push({ to: '/profile', label: 'Profile & Goals', icon: <Settings size={19} /> });

  return (
    <aside style={{
      width: '240px',
      background: 'rgba(10, 15, 29, 0.95)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.75rem',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.6875rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-dim)',
        }}>
          Menu
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#38bdf8' : 'var(--text-muted)',
              background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Practice reminder */}
      <div style={{
        background: 'rgba(17, 26, 48, 0.8)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem',
        marginTop: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)', marginBottom: '0.3rem' }}>
          <Sparkles size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>SpeakEasy Project</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          Small, consistent practice builds speaking confidence.
        </p>
      </div>
    </aside>
  );
};
