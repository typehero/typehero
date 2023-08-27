import { faker } from '@faker-js/faker';
import { type Prisma } from '@prisma/client';

export function VoteMock(userIds: string[]): Prisma.VoteCreateManyInput {
  return {
    userId: faker.helpers.arrayElement(userIds),
    rootType: 'CHALLENGE',
    challengeId: 2,
  };
}
