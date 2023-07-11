import { RoleTypes } from '@prisma/client';
import { getServerAuthSession } from '~/server/auth';
import { redirect } from 'next/navigation';

export default async function ListReportPage() {
  const session = await getServerAuthSession();
  const roles = session?.user?.role ?? [];
  const isMod = roles.includes(RoleTypes.ADMIN) || roles.includes(RoleTypes.MODERATOR);

  if (!isMod) {
    return redirect('/');
  }

  return <div>I am amazing</div>;
}
