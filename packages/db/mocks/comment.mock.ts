import { type Prisma } from '@prisma/client';
import { trashId } from '../seed';
import { faker } from '@faker-js/faker';

/**
 *
 * @returns Creates a mock user.
 */
export default function CommentMock(
  commentNumber: number,
  parentId?: number,
  userId?: string,
): Prisma.CommentCreateManyInput {
  return {
    text: `${faker.lorem.sentences()} ${
      !parentId ? commentNumber : `reply ${commentNumber} to parent ${parentId}`
    }`,
    userId: userId ?? trashId,
    parentId,
  };
}
