import { type Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function VoteMock(userIds: string[]): Prisma.VoteCreateManyInput {
  return {
    userId: faker.helpers.arrayElement(userIds),
  };
}
