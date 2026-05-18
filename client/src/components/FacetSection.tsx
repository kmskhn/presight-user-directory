import { Check } from 'lucide-react';
import { FacetSkeleton } from './UserCardSkeleton.js';
import type { FacetItem } from '../types/index.js';

interface FacetSectionProps {
  title: string;
  items: FacetItem[];
  selected: string[];
  onToggle: (value: string) => void;
  isLoading: boolean;
  idPrefix: string;
}

export function FacetSection({ title, items, selected, onToggle, isLoading, idPrefix }: FacetSectionProps) {
  return (
    <section aria-label={`${title} filters`}>
      <p className="sidebar__section-title">{title}</p>
      {isLoading ? (
        <FacetSkeleton count={6} />
      ) : items.length === 0 ? (
        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: 0 }}>No options</p>
      ) : (
        <ul className="facet-list" role="list">
          {items.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <li key={item.value} role="listitem">
                <button
                  id={`${idPrefix}-${item.value.replace(/\s+/g, '-')}`}
                  className={`facet-item${isSelected ? ' facet-item--selected' : ''}`}
                  onClick={() => onToggle(item.value)}
                  aria-pressed={isSelected}
                  aria-label={`${item.value} (${item.count} users)${isSelected ? ', selected' : ''}`}
                  style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  <span className="facet-item__checkbox" aria-hidden="true">
                    {isSelected && (
                      <Check size={10} color="white" strokeWidth={3} />
                    )}
                  </span>
                  <span className="facet-item__label">{item.value}</span>
                  <span className="facet-item__count" aria-label={`${item.count} users`}>
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
