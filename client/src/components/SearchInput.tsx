import { Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner.js';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
}

export function SearchInput({ value, onChange, isPending = false }: SearchInputProps) {
  return (
    <div className="search-wrap">
      <span className="search-icon" aria-hidden="true">
        <Search size={16} strokeWidth={2} />
      </span>
      <input
        id="search-input"
        type="search"
        className="search-input"
        placeholder="Search by name…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users by first or last name"
        autoComplete="off"
        spellCheck={false}
      />
      {isPending && (
        <span className="search-spinner" aria-hidden="true">
          <LoadingSpinner size="sm" label="Searching…" />
        </span>
      )}
    </div>
  );
}
