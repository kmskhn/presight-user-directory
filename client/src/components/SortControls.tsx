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
    <div className="flex items-center gap-2 bg-surface-raised border border-border/80 px-2.5 py-1.5 rounded-lg" role="group" aria-label="Sort options">
      <label htmlFor="sort-by-select" className="text-[0.78rem] text-text-muted shrink-0">
        Sort:
      </label>
      <select
        id="sort-by-select"
        className="bg-transparent border-none text-text-primary text-[0.825rem] font-medium min-w-[110px] cursor-pointer focus:outline-none focus:ring-0 [&>option]:bg-surface"
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
        className="flex items-center justify-center w-[26px] h-[26px] bg-transparent border-none rounded text-text-secondary cursor-pointer hover:bg-white/5 hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2"
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
