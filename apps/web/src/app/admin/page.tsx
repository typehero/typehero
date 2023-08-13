'use server';
import { RoleTypes } from '@repo/db';
import { Lock } from 'lucide-react';
import React from 'react';
import { getServerAuthSession } from '@repo/auth/server';
import { ChallengeReviews } from '~/components/admin/challenge-reviews';
import { getBannedUsers, getUploadedImages } from '~/components/admin/admin.actions';
import { ImageUploadReport } from '~/components/admin/images';
// import Reports2 from '~/components/admin/reports';
import { BannedUsers } from '~/components/admin/users';
import { getInfiniteReports } from '~/components/report/report.action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

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

// TODO: i think we need nested routing here so we can only load the data when the tab is active
// 💀 this has to be a job for trash
const View = async () => {
  const allBannedUsers = await getBannedUsers();
  // This needs done because server functions are dumb and this throws A LOT of errors otherwise.
  const firstPage = await getInfiniteReports();
  const uploadedimages = await getUploadedImages();

  return (
    <div className="container m-8 flex flex-col space-y-4">
      <div className="space-y-2">
        <div className="mx-2 flex flex-col">
          <p className="text-2xl font-semibold text-black dark:text-white">Moderation</p>
          <p className="text-start text-sm text-neutral-400 dark:text-neutral-600">
            A view of all the reports & users and all uploaded user images
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Tabs className="space-x-4" defaultValue="reports">
            <TabsList className="border-border bg-background rounded-full border">
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-2xl rounded-r-lg duration-300"
                value="reports"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border duration-300"
                value="challengeReviews"
              >
                Challenge Reviews
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-lg rounded-r-2xl duration-300"
                value="users"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-2xl rounded-r-lg duration-300"
                value="images"
              >
                Images
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports">
              <React.Suspense fallback={<>Loading...</>}>
                {/* <Reports2 initialReports={firstPage} /> */}
              </React.Suspense>
            </TabsContent>
            <TabsContent value="users">
              <BannedUsers data={allBannedUsers} />
            </TabsContent>
            <TabsContent value="challengeReviews">
              <ChallengeReviews />
            </TabsContent>
            <TabsContent value="images">
              <ImageUploadReport data={uploadedimages} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
