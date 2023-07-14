import { z } from 'zod';
import { type CreateChallengeState } from './create-challenge-store';

type MapToZod<T> = {
  [K in keyof T]: z.ZodType<T[K]>;
};

// TODO: Select better `.min(...).max(...)`
export const createChallengeValidator = z.object<
  MapToZod<NonNullable<CreateChallengeState['data']>>
>({
  name: z
    .string()
    .min(3, 'The name must be longer than 3 characters')
    .max(30, 'The name must be shorter than 30 characters'),
  prompt: z.string().max(65536),
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  description: z.string().min(20, 'The description must be longer than 20 characters').max(65536),
  shortDescription: z
    .string()
    .min(10, 'The short description must be longer than 10 characters')
    .max(191, 'The short description must be shorter than 191 characters'),
});
