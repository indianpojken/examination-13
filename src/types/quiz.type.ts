import { z } from 'zod';

import { quizValidation } from '../validations/mod.ts';

export type Question = z.infer<typeof quizValidation.question>;
