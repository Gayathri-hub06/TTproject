import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../services/api';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';
import { User, Shield, Save } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      setTargetRole(user.targetRole || 'Software Engineer');
      setDailyGoalMinutes(user.dailyGoalMinutes || 15);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await profileApi.updateProfile({
        displayName,
        targetRole,
        dailyGoalMinutes: Number(dailyGoalMinutes),
      });

      updateUserState({
        name: res.data.name,
        targetRole: res.data.targetRole,
        dailyGoalMinutes: res.data.dailyGoalMinutes,
      });

      setToastMessage('Profile and practice goals saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Profile & Goal Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Personalize your speaking target role and daily habit commitment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)', gap: '1.5rem' }}>
        {/* Profile Settings Form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={18} color="var(--accent-teal)" /> Personal Details
          </h3>

          <form onSubmit={handleSave}>
            <FormField
              label="Account Email"
              name="email"
              value={user?.email || ''}
              disabled
            />

            <FormField
              label="Display Name"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />

            <FormField
              label="Target Interview Role"
              name="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer, Data Analyst, Cloud Architect"
              required
            />

            <FormField
              label="Daily Practice Goal (Minutes)"
              name="dailyGoalMinutes"
              type="number"
              min={5}
              max={180}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              required
            />

            {/* AI On/Off Setting (Section 12.5) */}
            <div style={{
              background: 'rgba(10, 15, 29, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                  Enable AI Assistive Layer
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Allows adaptive prompts and weekly stories (rule fallback always active).
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon={<Save size={16} />}
              style={{ width: '100%' }}
            >
              Save Preferences
            </Button>
          </form>
        </div>

        {/* Privacy & Architecture Guarantee Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#06d6a0', marginBottom: '0.5rem' }}>
              <Shield size={16} />
              <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Privacy & Data Shield</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Audio recognition occurs purely in your local browser sandbox. Raw audio never touches any remote server, preserving total learner privacy.
            </p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
