import { Check } from 'lucide-react';
import { FacetSkeleton } from './UserCardSkeleton.js';
import type { FacetItem } from '../types/index.js';

interface FacetSectionProps {
  title: string;
  items: FacetItem[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear?: () => void;
  isLoading: boolean;
  idPrefix: string;
}

export function FacetSection({ title, items, selected, onToggle, onClear, isLoading, idPrefix }: FacetSectionProps) {
  return (
    <section aria-label={`${title} filters`}>
      <div className="flex justify-between items-center mb-3">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-text-muted m-0">{title}</p>
        {selected.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-transparent text-text-secondary border border-border rounded text-xs font-medium hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2"
            aria-label={`Clear all ${title} filters`}
          >
            Clear
          </button>
        )}
      </div>
      {isLoading ? (
        <FacetSkeleton count={6} />
      ) : items.length === 0 ? (
        <p className="text-xs text-text-muted m-0">No options</p>
      ) : (
        <ul className="list-none p-0 m-0 space-y-0.5" role="list">
          {items.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <li key={item.value} role="listitem">
                <button
                  id={`${idPrefix}-${item.value.replace(/\s+/g, '-')}`}
                  className={`flex items-center w-full px-2 py-1.5 rounded-md text-sm border-none bg-transparent cursor-pointer transition-colors text-left focus-visible:outline-2 focus-visible:outline-accent outline-offset-2 ${isSelected ? 'text-accent font-medium hover:bg-accent/10' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
                  onClick={() => onToggle(item.value)}
                  aria-pressed={isSelected}
                  aria-label={`${item.value} (${item.count} users)${isSelected ? ', selected' : ''}`}
                >
                  <span 
                    className={`flex-shrink-0 w-4 h-4 rounded-[4px] border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-accent border-accent' : 'border-border/80'}`} 
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <Check size={10} color="white" strokeWidth={3} />
                    )}
                  </span>
                  <span className="flex-1 truncate leading-tight">{item.value}</span>
                  <span className="text-xs text-text-muted bg-bg/50 px-1.5 py-0.5 rounded-[4px] font-mono leading-none" aria-label={`${item.count} users`}>
                    {item.count.toLocaleString()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
