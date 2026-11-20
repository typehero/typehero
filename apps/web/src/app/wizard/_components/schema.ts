import { z } from 'zod';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';

const testCaseRegex = new RegExp('(?:\n|^)s*(?:Equal|Extends|NotEqual|Expect)<');

export const createExploreCardSchema = z.object({
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME', 'EVENT']),
  name: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(3, 'The name must be longer than 3 characters')
      .max(30, 'The name must be shorter than 30 characters'),
  ),
  shortDescription: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(10, 'The short description must be longer than 10 characters')
      .max(191, 'The short description must be shorter than 191 characters'),
  ),
});

export const createDescriptionSchema = z.object({
  description: createNoProfanitySchemaWithValidate((zodString) =>
    zodString.min(20, 'The description must be longer than 20 characters').max(65536),
  ),
});

export const createTestCasesSchema = z.object({
  tests: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(20, 'The test cases must be longer than 20 characters')
      .max(65536)
      .regex(testCaseRegex, 'You need to have test cases in your challenge'),
  ),
  code: createNoProfanitySchemaWithValidate((zodString) => zodString.max(65536)),
});

export const createChallengeSchema = createExploreCardSchema
  .merge(createDescriptionSchema)
  .merge(createTestCasesSchema);

export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;
