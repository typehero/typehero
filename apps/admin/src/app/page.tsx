import { auth } from '@repo/auth/server';
import { RoleTypes } from '@repo/db/types';
import { Lock } from '@repo/ui/icons';
import { redirect } from 'next/navigation';

async function Admin() {
  const session = await auth();
  const roles = session?.user.role ?? [];

  const isMod = roles.includes(RoleTypes.MODERATOR);
  const isAdmin = roles.includes(RoleTypes.ADMIN);
  const isModOrAdmin = isAdmin || isMod;
  if (isModOrAdmin) redirect('/dashboard/reports');
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex min-h-[calc(100dvh-112px)] w-full flex-col items-center justify-center space-y-2">
          <Lock className="h-8 w-8" />
          <span className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
            You do not have permissions to access the page.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Admin;
