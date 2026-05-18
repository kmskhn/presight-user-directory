import { integer, sqliteTable, text, primaryKey, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    avatar: text('avatar').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    age: integer('age').notNull(),
    nationality: text('nationality').notNull(),
  },
  (t) => [
    index('idx_users_first_name_id').on(t.firstName, t.id),
    index('idx_users_last_name_id').on(t.lastName, t.id),
    index('idx_users_age_id').on(t.age, t.id),
    index('idx_users_nationality_id').on(t.nationality, t.id),
  ],
);

export const hobbies = sqliteTable('hobbies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const userHobbies = sqliteTable(
  'user_hobbies',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    hobbyId: integer('hobby_id')
      .notNull()
      .references(() => hobbies.id),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.hobbyId] }),
    index('idx_user_hobbies_hobby_id').on(t.hobbyId, t.userId),
  ],
);

// Types inferred from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Hobby = typeof hobbies.$inferSelect;
export type UserHobby = typeof userHobbies.$inferSelect;
