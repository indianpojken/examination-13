import { z } from 'zod';

export const submitScore = z.object({
  score: z.number().min(0),
});
