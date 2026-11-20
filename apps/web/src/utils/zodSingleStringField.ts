import { createNoProfanitySchemaWithValidate } from './antiProfanityZod';
import { z } from 'zod';
import { MAX_COMMENT_LENGTH } from '~/app/challenge/_components/comments/comments.constants';

export const singleFieldSchema = z.object({
  text: createNoProfanitySchemaWithValidate((zed) =>
    zed.min(1, 'Too short.').max(MAX_COMMENT_LENGTH, 'Too long.'),
  ),
});

export type SingleFieldSchema = z.infer<typeof singleFieldSchema>;
