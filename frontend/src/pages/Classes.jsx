import React, { useState, useEffect } from 'react';
import { classApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { Modal } from '../components/Modal';
import { Spinner } from '../components/Spinner';
import { Toast } from '../components/Toast';
import {
  GraduationCap,
  Users,
  Plus,
  KeyRound,
  BarChart2,
  TrendingDown,
  Activity,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const Classes = () => {
  const { user, role } = useAuth();
  const isTeacher = role === 'TEACHER' || role === 'ADMIN';

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student join class form
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  // Teacher create class modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);

  // Teacher stats modal
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedClassStats, setSelectedClassStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await classApi.getClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setJoining(true);
      await classApi.joinClass(joinCode.trim());
      setJoinCode('');
      setToastMessage('Successfully enrolled in class!');
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid class code or already joined.');
    } finally {
      setJoining(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      setCreating(true);
      const res = await classApi.createClass(newClassName.trim());
      setCreateModalOpen(false);
      setNewClassName('');
      setToastMessage(`Class created! Code: ${res.data.joinCode}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert('Unable to create class.');
    } finally {
      setCreating(false);
    }
  };

  const handleViewStats = async (classId) => {
    try {
      setLoadingStats(true);
      setStatsModalOpen(true);
      const res = await classApi.getClassStats(classId);
      setSelectedClassStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Spinner size={36} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading class records...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
            <GraduationCap size={14} /> Classroom Hub
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>
            {isTeacher ? 'Instructor Classes & Aggregate Analytics' : 'My Enrolled Classes'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isTeacher
              ? 'Share join codes with students. Student practice sentences stay strictly private; only aggregates are visible.'
              : 'Join a classroom batch to let your instructor review progress trends.'}
          </p>
        </div>

        {isTeacher && (
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="primary"
            icon={<Plus size={18} />}
          >
            Create New Class
          </Button>
        )}
      </div>

      {/* Student Join Form (If Student) */}
      {!isTeacher && (
        <div className="glass-card" style={{ maxWidth: '520px', marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <KeyRound size={17} color="var(--accent-teal)" /> Join Class with Code
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Enter the 6-character code given by your teacher (e.g. <strong>SPK101</strong>).
          </p>

          <form onSubmit={handleJoinClass} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. SPK101"
              maxLength={10}
              className="form-input"
              style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}
            />
            <Button type="submit" variant="primary" loading={joining}>
              Join
            </Button>
          </form>
        </div>
      )}

      {/* Class List Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {classes.map((cls) => (
          <div key={cls.classId} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-teal" style={{ letterSpacing: '0.08em' }}>
                  Code: {cls.joinCode}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {cls.studentCount || 0} Students
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.3rem' }}>{cls.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                Instructor: <strong>{cls.teacherName || 'Faculty Coach'}</strong>
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              {isTeacher ? (
                <Button
                  onClick={() => handleViewStats(cls.classId)}
                  variant="secondary"
                  size="sm"
                  icon={<BarChart2 size={15} />}
                  style={{ width: '100%' }}
                >
                  View Aggregate Analytics
                </Button>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#06d6a0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Enrolled (Sentences Private)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <GraduationCap size={44} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Classes Registered</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isTeacher ? 'Click "Create New Class" to set up your first cohort code.' : 'Enter a class code above to join a batch.'}
          </p>
        </div>
      )}

      {/* Teacher Create Class Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Classroom Batch"
      >
        <form onSubmit={handleCreateClass}>
          <FormField
            label="Class / Batch Name"
            name="newClassName"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g. CS Placement Communications 2026"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={creating}>
              Create & Generate Code
            </Button>
          </div>
        </form>
      </Modal>

      {/* Teacher Aggregate Analytics Modal (Feature 11) */}
      <Modal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        title={selectedClassStats ? `Class Analytics · ${selectedClassStats.className}` : 'Class Analytics'}
        maxWidth="680px"
      >
        {loadingStats ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spinner />
          </div>
        ) : selectedClassStats ? (
          <div>
            {/* Privacy notice banner */}
            <div style={{
              background: 'rgba(6, 214, 160, 0.08)',
              border: '1px solid rgba(6, 214, 160, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.8125rem',
              color: '#a7f3d0',
            }}>
              <ShieldCheck size={18} />
              <span>
                <strong>Privacy Guaranteed:</strong> Individual student sentences and mistakes stay 100% private. Only anonymized class-wide aggregates are computed.
              </span>
            </div>

            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class Pace Avg</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {selectedClassStats.avgWordsPerMin} wpm
                </div>
              </div>
              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class Fillers Avg</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {selectedClassStats.avgFillerCount}/min
                </div>
              </div>
              <div style={{ background: 'rgba(10, 15, 29, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fear Reduction</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#06d6a0' }}>
                  -{selectedClassStats.avgFearReduction} pts
                </div>
              </div>
            </div>

            {/* Top Fillers Distribution */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.65rem' }}>
                Most Frequent Classroom Filler Words:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedClassStats.topFillerWords && Object.entries(selectedClassStats.topFillerWords).map(([word, freq]) => (
                  <span key={word} className="badge badge-amber" style={{ padding: '0.35rem 0.75rem' }}>
                    "{word}": {freq}% of pauses
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
