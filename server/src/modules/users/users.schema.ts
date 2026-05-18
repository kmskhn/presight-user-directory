import { z } from 'zod';

export const usersQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  nationalities: z.string().optional().default(''),
  hobbies: z.string().optional().default(''),
  sortBy: z
    .enum(['first_name', 'last_name', 'age', 'nationality'])
    .optional()
    .default('first_name'),
  sortDir: z.enum(['asc', 'desc']).optional().default('asc'),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(30),
});

export type UsersQueryInput = z.input<typeof usersQuerySchema>;
export type UsersQueryParsed = z.output<typeof usersQuerySchema>;
