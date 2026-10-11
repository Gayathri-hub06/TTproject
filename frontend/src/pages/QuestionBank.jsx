import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';
import { Plus, Edit, Trash2, Sliders, HelpCircle, Save } from 'lucide-react';

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Modal (Add / Edit)
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ role: 'Software Engineer', category: 'Behavioral', questionText: '' });
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // XP Weights Modal
  const [weightsModalOpen, setWeightsModalOpen] = useState(false);
  const [xpWeights, setXpWeights] = useState(null);
  const [savingWeights, setSavingWeights] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchQuestions(currentPage, search);
  }, [currentPage, search]);

  const fetchQuestions = async (page, query) => {
    try {
      setLoading(true);
      const res = await adminApi.getQuestions(page, 10, query);
      setQuestions(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ role: 'Software Engineer', category: 'Behavioral', questionText: '' });
    setFormModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingId(q.questionId);
    setFormData({ role: q.role, category: q.category, questionText: q.questionText });
    setFormModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.questionText.trim()) return;

    try {
      setSaving(true);
      if (editingId) {
        await adminApi.updateQuestion(editingId, formData);
        setToastMessage('Question successfully updated!');
      } else {
        await adminApi.createQuestion(formData);
        setToastMessage('New question added to repository!');
      }
      setFormModalOpen(false);
      fetchQuestions(currentPage, search);
    } catch (err) {
      console.error(err);
      alert('Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi.deleteQuestion(deleteTarget.questionId);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      setToastMessage('Question removed.');
      fetchQuestions(currentPage, search);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenWeights = async () => {
    setWeightsModalOpen(true);
    try {
      const res = await adminApi.getXpWeights();
      setXpWeights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveWeights = async (e) => {
    e.preventDefault();
    try {
      setSavingWeights(true);
      await adminApi.updateXpWeights(xpWeights);
      setToastMessage('Reward Engine weights updated!');
      setWeightsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingWeights(false);
    }
  };

  const columns = [
    {
      header: 'Role',
      render: (row) => <span className="badge badge-blue">{row.role}</span>,
      width: '160px',
    },
    {
      header: 'Category',
      render: (row) => <span className="badge badge-purple">{row.category}</span>,
      width: '140px',
    },
    {
      header: 'Question Text',
      render: (row) => <span style={{ color: '#f8fafc', fontWeight: 500 }}>"{row.questionText}"</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      width: '120px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleOpenEdit(row)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => {
              setDeleteTarget(row);
              setDeleteModalOpen(true);
            }}
            className="btn btn-danger btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

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
          <div className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>
            <HelpCircle size={14} /> Administrator Control Center
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Interview Question Bank (CRUD)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Curate questions for mock interviews and tune reward engine XP weights.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            onClick={handleOpenWeights}
            variant="secondary"
            icon={<Sliders size={16} />}
          >
            XP Weights Config
          </Button>

          <Button
            onClick={handleOpenAdd}
            variant="primary"
            icon={<Plus size={18} />}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem', maxWidth: '380px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by role or keyword..."
          className="form-input"
        />
      </div>

      <DataTable
        columns={columns}
        data={questions}
        keyExtractor={(row) => row.questionId}
        loading={loading}
        emptyMessage="No questions matched the query."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingId ? 'Edit Interview Question' : 'Add New Interview Question'}
      >
        <form onSubmit={handleSaveQuestion}>
          <FormField
            label="Target Professional Role"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Software Engineer, Data Analyst, HR"
            required
          />

          <FormField
            label="Question Category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. Behavioral, Technical, Icebreaker"
            required
          />

          <FormField
            label="Question Prompt"
            name="questionText"
            as="textarea"
            rows={3}
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            placeholder="Enter the full interview prompt..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
              Save Question
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Question Confirmation"
        maxWidth="440px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Are you sure you want to remove this interview question from the repository?
        </p>
      </Modal>

      {/* XP Weights Tuner Modal */}
      <Modal
        isOpen={weightsModalOpen}
        onClose={() => setWeightsModalOpen(false)}
        title="Reward Engine: XP Point Weights"
        maxWidth="520px"
      >
        {xpWeights && (
          <form onSubmit={handleSaveWeights}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField
                label="Sentence Practised (XP)"
                name="sentenceXp"
                type="number"
                value={xpWeights.sentenceXp || 10}
                onChange={(e) => setXpWeights({ ...xpWeights, sentenceXp: Number(e.target.value) })}
              />

              <FormField
                label="Better Repeat (XP)"
                name="improvedRepeatXp"
                type="number"
                value={xpWeights.improvedRepeatXp || 5}
                onChange={(e) => setXpWeights({ ...xpWeights, improvedRepeatXp: Number(e.target.value) })}
              />

              <FormField
                label="Mock Interview (XP)"
                name="interviewAnswerXp"
                type="number"
                value={xpWeights.interviewAnswerXp || 30}
                onChange={(e) => setXpWeights({ ...xpWeights, interviewAnswerXp: Number(e.target.value) })}
              />

              <FormField
                label="Drill Correct (XP)"
                name="drillCorrectXp"
                type="number"
                value={xpWeights.drillCorrectXp || 5}
                onChange={(e) => setXpWeights({ ...xpWeights, drillCorrectXp: Number(e.target.value) })}
              />

              <FormField
                label="Filler-Free Bonus (XP)"
                name="fillerFreeBonus"
                type="number"
                value={xpWeights.fillerFreeBonus || 5}
                onChange={(e) => setXpWeights({ ...xpWeights, fillerFreeBonus: Number(e.target.value) })}
              />

              <FormField
                label="Streak Bonus per Day"
                name="streakBonusPerDay"
                type="number"
                value={xpWeights.streakBonusPerDay || 2}
                onChange={(e) => setXpWeights({ ...xpWeights, streakBonusPerDay: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="secondary" onClick={() => setWeightsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={savingWeights} icon={<Save size={16} />}>
                Apply Configuration
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
