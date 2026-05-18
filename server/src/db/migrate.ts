import { sqlite } from './index.js';

export function runMigrations() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      avatar     TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name  TEXT NOT NULL,
      age        INTEGER NOT NULL,
      nationality TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hobbies (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS user_hobbies (
      user_id  INTEGER NOT NULL REFERENCES users(id),
      hobby_id INTEGER NOT NULL REFERENCES hobbies(id),
      PRIMARY KEY (user_id, hobby_id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_first_name_id ON users(first_name, id);
    CREATE INDEX IF NOT EXISTS idx_users_last_name_id  ON users(last_name, id);
    CREATE INDEX IF NOT EXISTS idx_users_age_id        ON users(age, id);
    CREATE INDEX IF NOT EXISTS idx_users_nationality_id ON users(nationality, id);
    CREATE INDEX IF NOT EXISTS idx_users_first_name    ON users(first_name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_users_last_name     ON users(last_name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby_id ON user_hobbies(hobby_id, user_id);
  `);

  console.log('✅ Migrations complete');
}

// Run directly if called as script
runMigrations();
