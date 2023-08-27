import { type Prisma } from '@prisma/client';
import { trashId } from '../seed';

/**
 *
 * @returns Creates a mock user.
 */
export default function CommentMock(
  commentNumber: number,
  parentId?: number,
): Prisma.CommentCreateManyInput {
  return {
    text: `here is a comment ${
      !parentId ? commentNumber : `reply ${commentNumber} to parent ${parentId}`
    }`,
    userId: trashId,
    parentId,
  };
}
