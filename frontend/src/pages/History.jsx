import React, { useState, useEffect } from 'react';
import { sessionApi } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { ResultCard } from '../components/ResultCard';
import { HesitationHeatmap } from '../components/HesitationHeatmap';
import { Eye, Trash2, Calendar, Activity, AlertTriangle } from 'lucide-react';

export const History = () => {
  const [sessions, setSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Selected session for Detail Modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Selected session for Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage]);

  const fetchSessions = async (page) => {
    try {
      setLoading(true);
      const res = await sessionApi.getSessions(page, 10, 'createdAt', 'desc');
      setSessions(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (session) => {
    try {
      const res = await sessionApi.getSessionById(session.sessionId);
      setSelectedSession(res.data);
      setDetailModalOpen(true);
    } catch (err) {
      console.error(err);
      setSelectedSession(session);
      setDetailModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await sessionApi.deleteSession(deleteTarget.sessionId);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchSessions(currentPage);
    } catch (err) {
      console.error(err);
      alert('Unable to delete session.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Date & Time',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(row.createdAt).toLocaleDateString()} {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Spoken Sentence (Said)',
      render: (row) => (
        <span style={{ fontWeight: 500, color: '#f8fafc', maxWidth: '320px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          "{row.originalText}"
        </span>
      ),
    },
    {
      header: 'Pace (WPM)',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
          {row.wordsPerMin} WPM
        </span>
      ),
    },
    {
      header: 'Fillers',
      render: (row) => (
        <span className={`badge ${row.fillerCount <= 1 ? 'badge-teal' : row.fillerCount <= 3 ? 'badge-amber' : 'badge-red'}`}>
          {row.fillerCount}
        </span>
      ),
    },
    {
      header: 'Mistakes',
      render: (row) => (
        <span style={{ fontSize: '0.8125rem', color: row.mistakeCount > 0 ? '#fbbf24' : '#06d6a0' }}>
          {row.mistakeCount} fixed
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleOpenDetail(row)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => {
              setDeleteTarget(row);
              setDeleteModalOpen(true);
            }}
            className="btn btn-danger btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            title="Delete Session"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Practice History & Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Review past sentences, cadence progression, and pronunciation polish.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        keyExtractor={(row) => row.sessionId}
        loading={loading}
        emptyMessage="No practice sessions recorded yet. Start your first session in the Practice Arena!"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Session Details Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Session Cadence & Phrasing Detail"
        maxWidth="700px"
      >
        {selectedSession && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <ResultCard type="said" title="What You Said" text={selectedSession.originalText} />
              <ResultCard type="fixed" title="Grammar Correction" text={selectedSession.correctedText} />
              <ResultCard type="better" title="Say It Better (Interview Ready)" text={selectedSession.improvedText} />
            </div>

            {/* Metrics Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              background: 'rgba(10, 15, 29, 0.8)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pace</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {selectedSession.wordsPerMin || 0} wpm
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fillers</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                  {selectedSession.fillerCount || 0}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pauses</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f87171' }}>
                  {selectedSession.pauseCount || 0}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                  {selectedSession.durationSec || 0}s
                </div>
              </div>
            </div>

            {/* Hesitation Heatmap */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Hesitation Timing Heatmap:
              </span>
              <HesitationHeatmap
                wordPauses={
                  typeof selectedSession.wordPauses === 'string'
                    ? JSON.parse(selectedSession.wordPauses || '[]')
                    : selectedSession.wordPauses || []
                }
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Session Confirmation"
        maxWidth="440px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Yes, Delete Permanently
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Are you sure you want to remove this practice record? All associated metrics and mistakes will be permanently deleted.
        </p>
      </Modal>
    </div>
  );
};
