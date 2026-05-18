import { Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner.js';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
}

export function SearchInput({ value, onChange, isPending = false }: SearchInputProps) {
  return (
    <div className="ml-2 relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center justify-center pointer-events-none" aria-hidden="true">
        <Search size={16} strokeWidth={2} />
      </span>
      <input
        id="search-input"
        type="search"
        className="w-full bg-surface-raised border border-border text-text-primary text-[0.875rem] pl-9 pr-9 py-[0.55rem] rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-text-muted/70"
        placeholder="Search by name…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users by first or last name"
        autoComplete="off"
        spellCheck={false}
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <LoadingSpinner size="sm" label="Searching…" />
        </span>
      )}
    </div>
  );
}
