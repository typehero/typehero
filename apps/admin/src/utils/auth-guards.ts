import type { Session } from '@repo/auth/server';
import { RoleTypes } from '@repo/db/types';

export const assertAdmin = (session: Session | null) => {
  const isAdmin = session?.user.role.includes(RoleTypes.ADMIN);

  if (!isAdmin) {
    throw new Error('You are not authorized to perform this action.');
  }
};
