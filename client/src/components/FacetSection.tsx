import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section aria-label={`${title} filters`}>
      <div className="flex justify-between items-center mb-3 h-7">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 p-0 bg-transparent border-none cursor-pointer text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2"
          aria-expanded={isExpanded}
          aria-controls={`facet-list-${idPrefix}`}
        >
          <span className="text-[11px] font-semibold tracking-wider uppercase m-0 leading-none">{title}</span>
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>
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
      
      <div 
        id={`facet-list-${idPrefix}`}
        className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          {isLoading ? (
            <FacetSkeleton count={6} />
          ) : items.length === 0 ? (
            <p className="text-xs text-text-muted m-0 pt-0.5 pb-2">No options</p>
          ) : (
            <ul className="list-none p-0 m-0 space-y-0.5 pt-0.5 pb-2" role="list">
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
        </div>
      </div>
    </section>
  );
}
