import { createApp } from './app.js';
import { runMigrations } from './db/migrate.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Run migrations on startup
runMigrations();

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
