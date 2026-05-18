import { memo } from 'react';
import type { UserRow } from '../types/index.js';

interface UserCardProps {
  user: UserRow;
}

export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  const displayHobbies = user.hobbies.slice(0, 2);
  const overflowCount = user.hobbies.length - 2;

  return (
    <article className="grid grid-cols-[52px_1fr] gap-3.5 items-center p-4 mx-5 bg-surface/50 border border-border/50 rounded-xl transition-all duration-200 hover:border-border hover:shadow-lg hover:-translate-y-0.5 group" role="listitem">
      <img
        src={user.avatar}
        alt={`Avatar of ${user.firstName} ${user.lastName}`}
        className="w-[52px] h-[52px] rounded-full object-cover border border-border/80 bg-surface-raised transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        width={52}
        height={52}
      />
      <div className="flex flex-col min-w-0">
        <p className="m-0 font-medium text-text-primary text-[0.95rem] tracking-tight truncate">
          {user.firstName} {user.lastName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-secondary">
          <span>{user.nationality}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-border" aria-hidden="true" />
          <span>{user.age} yrs</span>
        </div>
        {user.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2" aria-label="Hobbies">
            {displayHobbies.map((hobby) => (
              <span key={hobby} className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.68rem] font-medium bg-surface-raised text-text-muted border border-border/50 whitespace-nowrap">
                {hobby}
              </span>
            ))}
            {overflowCount > 0 && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.68rem] font-medium bg-transparent text-text-muted border border-dashed border-border/70 whitespace-nowrap"
                title={user.hobbies.slice(2).join(', ')}
              >
                +{overflowCount}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
});
