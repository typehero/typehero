import { type Prisma } from '@prisma/client';
import { trashId } from '../seed';

/**
 *
 * @returns Creates a mock user.
 */
export default function CommentMock(parentId?: number): Prisma.CommentCreateManyInput {
  return {
    text: 'here is a comment',
    userId: trashId,
    parentId,
  };
}
