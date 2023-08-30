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
): Prisma.CommentCreateManyInput {
  return {
    text: `${faker.lorem.sentences()} ${
      !parentId ? commentNumber : `reply ${commentNumber} to parent ${parentId}`
    }`,
    userId: trashId,
    parentId,
  };
}
