import { RoleTypes, type Role } from '@repo/db/types';

export type TitleInfo = ReturnType<typeof getTitles>[number];
export function getTitles(roles: Role[]) {
  const flairs: { type: 'admin' | 'contributor' | 'supporter'; label: string }[] = [];
  if (roles.find((r) => r.role === RoleTypes.ADMIN)) {
    flairs.push({ type: 'admin', label: 'Admin' });
  }
  if (roles.find((r) => r.role === RoleTypes.CONTRIBUTOR)) {
    flairs.push({ type: 'contributor', label: 'Contributor' });
  }
  if (roles.find((r) => r.role === RoleTypes.SUPPORTER)) {
    flairs.push({ type: 'supporter', label: 'Hero' });
  }
  return flairs;
}
