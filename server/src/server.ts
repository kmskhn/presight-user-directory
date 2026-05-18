import { createApp } from './app.js';
import { runMigrations } from './db/migrate.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('[Fatal] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Fatal] Unhandled Rejection:', reason);
  process.exit(1);
});

// Run migrations on startup
runMigrations();

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
