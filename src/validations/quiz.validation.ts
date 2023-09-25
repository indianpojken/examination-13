import { z } from 'zod';

export const question = z.object({
  question: z.string().min(3).max(50),
  answer: z.string(),
  location: z.object({
    longitude: z.string(),
    latitude: z.string(),
  }),
});

export const createQuiz = z.object({
  name: z.string().min(5),
});

export const addQuestion = question;
