import { z } from 'zod';

export const loginUser = z.object({
  username: z
    .string()
    .min(5)
    .max(20)
    .refine((string) => string === string.toLowerCase(), {
      message: 'Only lowercase letters are allowed in username',
    }),
  password: z.string().min(8).max(30),
});

export const registerUser = loginUser;
