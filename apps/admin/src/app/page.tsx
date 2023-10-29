import { getServerAuthSession } from '@repo/auth/server';
import { RoleTypes } from '@repo/db/types';
import { Lock } from '@repo/ui/icons';
import { getBannedUsers, getUploadedImages } from './_components/admin.actions';
import { getInfiniteReports } from './report/[id]/_components/report/report.action';
import { TabView } from './_components/TabView';

async function Admin() {
  const session = await getServerAuthSession();
  const roles = session?.user.role ?? [];

  const isMod = roles.includes(RoleTypes.MODERATOR);
  const isAdmin = roles.includes(RoleTypes.ADMIN);
  const isModOrAdmin = isAdmin || isMod;

  const allBannedUsers = await getBannedUsers();
  const reports = await getInfiniteReports();
  const uploadedImages = await getUploadedImages();

  return (
    <div>
      <div className="flex flex-col gap-4">
        {isModOrAdmin ? (
          <TabView
            allBannedUsers={allBannedUsers}
            reports={reports}
            uploadedImages={uploadedImages}
          />
        ) : (
          <div className="flex min-h-[calc(100dvh-112px)] w-full flex-col items-center justify-center space-y-2">
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

export default Admin;
