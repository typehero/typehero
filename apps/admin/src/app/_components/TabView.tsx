'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import type { InfiniteReports } from '../report/[id]/_components/report/report.action';
import type { BannedUsers, UploadedImages } from './admin.actions';
import { ChallengeReviews } from './challenge-reviews';
import { ImageUploadReport } from './images';
import Reports from './reports';
import { ManageTracks } from './tracks';
import { BannedUsers as BannedUserComponent } from './users';

interface Props {
  reports: InfiniteReports;
  allBannedUsers: BannedUsers;
  uploadedImages: UploadedImages;
}

export function TabView({ reports, allBannedUsers, uploadedImages }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'reports';
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
          <Tabs className="space-x-4" defaultValue={tab}>
            <TabsList className="border-border bg-background rounded-full border">
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-2xl rounded-r-lg duration-300"
                value="reports"
                onClick={() => {
                  router.push('/?tab=reports');
                }}
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border duration-300"
                value="challengeReviews"
                onClick={() => {
                  router.push('/?tab=challengeReviews');
                }}
              >
                Challenge Reviews
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border duration-300"
                value="users"
                onClick={() => {
                  router.push('/?tab=users');
                }}
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border duration-300"
                value="images"
                onClick={() => {
                  router.push('/?tab=images');
                }}
              >
                Images
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-lg rounded-r-2xl duration-300"
                value="tracks"
                onClick={() => {
                  router.push('/?tab=tracks');
                }}
              >
                Tracks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports">
              <React.Suspense fallback={<>Loading...</>}>
                <Reports initialReports={reports} />
              </React.Suspense>
            </TabsContent>
            <TabsContent value="users">
              <BannedUserComponent data={allBannedUsers} />
            </TabsContent>
            <TabsContent value="challengeReviews">
              <ChallengeReviews />
            </TabsContent>
            <TabsContent value="images">
              <ImageUploadReport data={uploadedImages} />
            </TabsContent>
            <TabsContent value="tracks">
              <ManageTracks />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
