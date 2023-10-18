import { faker } from '@faker-js/faker';
import { type Prisma } from '@prisma/client';
import { trashId } from '../seed/dev';

export function createComment(
  commentNumber: number,
  parentId?: number,
): Prisma.CommentCreateManyInput {
  return {
    text: `here is a comment ${
      !parentId ? commentNumber : `reply ${commentNumber} to parent ${parentId}`
    }`,
    userId: trashId,
    parentId,
    createdAt: faker.date.past(),
  };
}
