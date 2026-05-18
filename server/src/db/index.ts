import Database, { type Database as SqliteDatabase } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = process.env.DATABASE_PATH ?? './data/users.db';

// Ensure data directory exists
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite: SqliteDatabase = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export { sqlite };
