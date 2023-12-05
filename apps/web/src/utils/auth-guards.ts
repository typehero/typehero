import type { Session } from '@repo/auth/server';
import { RoleTypes } from '@repo/db/types';

export function isAdminOrModerator(session: Session | null) {
  return [RoleTypes.ADMIN, RoleTypes.MODERATOR].some((i) => session?.user?.role.includes(i));
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return Boolean(userId && session?.user?.id && userId === session?.user?.id);
}
