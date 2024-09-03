import { z } from 'zod';
import { createNoProfanitySchemaWithValidate } from './antiProfanityZod';

export const singleFieldSchema = z.object({
  text: createNoProfanitySchemaWithValidate((zed) => zed.min(1, 'Too short.')),
});

export type SingleFieldSchema = z.infer<typeof singleFieldSchema>;
