import { memo } from 'react';
import type { UserRow } from '../types/index.js';

interface UserCardProps {
  user: UserRow;
}

export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  const displayHobbies = user.hobbies.slice(0, 2);
  const overflowCount = user.hobbies.length - 2;

  return (
    <article className="user-card" role="listitem">
      <img
        src={user.avatar}
        alt={`Avatar of ${user.firstName} ${user.lastName}`}
        className="user-card__avatar"
        loading="lazy"
        width={52}
        height={52}
      />
      <div className="user-card__body">
        <p className="user-card__name">
          {user.firstName} {user.lastName}
        </p>
        <div className="user-card__meta">
          <span>{user.nationality}</span>
          <span className="user-card__meta-dot" aria-hidden="true" />
          <span>{user.age} yrs</span>
        </div>
        {user.hobbies.length > 0 && (
          <div className="user-card__hobbies" aria-label="Hobbies">
            {displayHobbies.map((hobby) => (
              <span key={hobby} className="hobby-badge">
                {hobby}
              </span>
            ))}
            {overflowCount > 0 && (
              <span
                className="hobby-badge hobby-badge--overflow"
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
