import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { usersRouter } from './modules/users/users.router.js';

export function createApp() {
  const app = express();

  // CORS — allow only the frontend origin
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_ORIGIN ?? '',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      methods: ['GET'],
    }),
  );

  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/users', usersRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });

  // Global error handler (Express 5 — async errors automatically propagated)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err);
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err instanceof Error
          ? err.message
          : String(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message } });
  });

  return app;
}
