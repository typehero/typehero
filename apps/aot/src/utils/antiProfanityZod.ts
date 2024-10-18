import type { ZodString } from 'zod';
import { z } from 'zod';
import { containsProfanity } from './profanity';

// throws if string contains profanity, uses custom validate function
export function createNoProfanitySchemaWithValidate(validate: (zodString: ZodString) => ZodString) {
  return validate(z.string()).refine((str) => !containsProfanity(str), "Don't use profanity.");
}

// throws if string contains profanity, no other checks
export function createNoProfanitySchema() {
  return z.string().refine((str) => !containsProfanity(str), "Don't use profanity.");
}
