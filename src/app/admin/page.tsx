import { RoleTypes } from '@prisma/client';
import { Lock } from 'lucide-react';
import { getBannedUsers, getChallengeReports } from '~/components/admin/admin.actions';
import { ReportDetails } from '~/components/admin/reports';
import { BannedUsers } from '~/components/admin/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getServerAuthSession } from '~/server/auth';

async function Admin() {
  const session = await getServerAuthSession();
  const roles = session?.user.role ?? [];

  const isMod = roles.includes(RoleTypes.MODERATOR);
  const isAdmin = roles.includes(RoleTypes.ADMIN);
  const isModOrAdmin = isAdmin || isMod;

  return (
    <div>
      <div className="flex flex-col gap-4">
        {isModOrAdmin ? (
          <View />
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

const View = async () => {
  const allReports = await getChallengeReports();
  const allBannedUsers = await getBannedUsers();

  return (
    <div className="m-8 flex flex-col space-y-4">
      <div className="space-y-2">
        <div className="mx-2 flex flex-col">
          <p className="text-2xl font-semibold text-black dark:text-white">Moderation</p>
          <p className="max-w-[40ch] text-start text-sm text-neutral-400 dark:text-neutral-600">
            A view of all the reports & users.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Tabs defaultValue="reports" className="space-x-4">
            <TabsList className="rounded-full border border-border bg-background">
              <TabsTrigger
                className="rounded-l-2xl rounded-r-lg duration-300 data-[state=active]:bg-border"
                value="reports"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                className="rounded-l-2xl rounded-r-lg duration-300 data-[state=active]:bg-border"
                value="users"
              >
                Users
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports">
              <ReportDetails data={allReports} />
            </TabsContent>
            <TabsContent value="users">
              <BannedUsers data={allBannedUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
