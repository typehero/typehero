import { RoleTypes, type Role } from '@repo/db/types';

export type TitleInfo = ReturnType<typeof getTitles>[number];
export function getTitles(roles: Role[]) {
  const flairs: {
    type: 'admin' | 'contributor' | 'supporter';
    label: string;
    description?: string;
  }[] = [];
  if (roles.find((r) => r.role === RoleTypes.ADMIN)) {
    flairs.push({ type: 'admin', label: 'Admin' });
  }
  if (roles.find((r) => r.role === RoleTypes.CONTRIBUTOR)) {
    flairs.push({
      type: 'contributor',
      label: 'Contributor',
      description: 'Contributed to the project',
    });
  }
  if (roles.find((r) => r.role === RoleTypes.SUPPORTER)) {
    flairs.push({
      type: 'supporter',
      label: 'Supporter',
      description: 'Donated money to the project',
    });
  }
  return flairs;
}

const TITLE_TO_CLASSNAME: Record<TitleInfo['type'], string> = {
  admin: 'bg-gradient-to-r from-rose-400 to-orange-500 dark:from-rose-400 dark:to-orange-300',
  contributor: 'bg-gradient-to-r from-sky-400 to-cyan-600 dark:from-sky-400 dark:to-cyan-300',
  supporter:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-200 dark:to-emerald-500',
};
export function getGradient(roles: Role[]) {
  if (roles.find((r) => r.role === 'ADMIN')) {
    return TITLE_TO_CLASSNAME.admin;
  }
  if (roles.find((r) => r.role === 'CONTRIBUTOR')) {
    return TITLE_TO_CLASSNAME.contributor;
  }
  if (roles.find((r) => r.role === 'SUPPORTER')) {
    return TITLE_TO_CLASSNAME.supporter;
  }
  return 'text-foreground';
}
