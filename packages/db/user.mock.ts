import { faker } from '@faker-js/faker';
import { type Prisma, UserStatus } from '@prisma/client';

/**
 *
 * @returns Creates a mock user.
 */
export default function UserMock(): Prisma.UserCreateManyInput {
  // Create email
  const email = faker.internet.email();
  // Created At
  const createdAt = faker.date.between({ from: '2022-06-01', to: new Date() });

  return {
    email,
    emailVerified: faker.date.between({ from: createdAt, to: new Date() }),
    name: faker.person.fullName(),
    status: faker.helpers.enumValue(UserStatus),
    createdAt,
  };
}
