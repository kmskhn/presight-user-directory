import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Filters } from '../types/index.js';

interface SortControlsProps {
  sortBy: Filters['sortBy'];
  sortDir: Filters['sortDir'];
  onSortByChange: (value: Filters['sortBy']) => void;
  onSortDirChange: (value: Filters['sortDir']) => void;
}

const SORT_OPTIONS: { value: Filters['sortBy']; label: string }[] = [
  { value: 'first_name', label: 'First name' },
  { value: 'last_name', label: 'Last name' },
  { value: 'age', label: 'Age' },
  { value: 'nationality', label: 'Nationality' },
];

export function SortControls({ sortBy, sortDir, onSortByChange, onSortDirChange }: SortControlsProps) {
  return (
    <div className="sort-controls" role="group" aria-label="Sort options">
      <label htmlFor="sort-by-select" style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', flexShrink: 0 }}>
        Sort:
      </label>
      <select
        id="sort-by-select"
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as Filters['sortBy'])}
        aria-label="Sort by field"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        id="sort-dir-btn"
        className="sort-dir-btn"
        onClick={() => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort direction: ${sortDir === 'asc' ? 'ascending' : 'descending'}. Click to toggle.`}
        title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortDir === 'asc' ? (
          <ArrowUp size={16} strokeWidth={2} />
        ) : (
          <ArrowDown size={16} strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
