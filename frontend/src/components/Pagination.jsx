import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalElements = 0,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '1.25rem',
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
    }}>
      <div>
        Showing page <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentPage + 1}</span> of{' '}
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{totalPages}</span> ({totalElements} items)
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.65rem' }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.65rem' }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
