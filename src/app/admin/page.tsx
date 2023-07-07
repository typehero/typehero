import { RoleTypes } from '@prisma/client';
import { Lock } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';

async function Admin() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.role ?? [];

  const isMod = roles.includes(RoleTypes.MODERATOR);
  const isAdmin = roles.includes(RoleTypes.ADMIN);
  const isModOrAdmin = isAdmin || isMod;

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        {isModOrAdmin ? (
          <ModerationView />
        ) : (
          <div
            className="flex w-full flex-col items-center justify-center space-y-2"
            // TODO: i bet there is a css/tw way to do this, @Nikita can fix in 2ms
            style={{ minHeight: 'calc(100dvh - 112px)' }}
          >
            <Lock className="h-8 w-8" />
            <span className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
              You do not have permissions to access the page.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const ModerationView = async () => {
  const session = await getServerSession(authOptions);
  const roles = session?.user.role ?? [];

  return (
    <div>
      <p className="text-center text-2xl text-white">Moderation View</p>
      <div className="m-8">
        Roles:
        <div>{JSON.stringify(roles)}</div>
      </div>
    </div>
  );
};

export default Admin;
