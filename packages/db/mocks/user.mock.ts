import { faker } from '@faker-js/faker';
import { type Prisma } from '@prisma/client';

export function createUser(): Prisma.UserCreateManyInput {
  // Create email
  const email = faker.internet.email();
  // Created At
  const createdAt = faker.date.between({ from: '2022-06-01', to: new Date() });

  return {
    email,
    emailVerified: faker.date.between({ from: createdAt, to: new Date() }),
    name: faker.person.fullName(),
    status: 'ACTIVE',
    createdAt,
  };
}

export const createUsers = (numberOfUsersToCreate: number) =>
  Array.from({ length: numberOfUsersToCreate }, () => createUser());
