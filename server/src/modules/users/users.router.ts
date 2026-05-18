import { Router } from 'express';
import { usersQuerySchema } from './users.schema.js';
import { getUsersResponse } from './users.service.js';

export const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  const parsed = usersQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: parsed.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const result = getUsersResponse(parsed.data);
  res.json(result);
});
