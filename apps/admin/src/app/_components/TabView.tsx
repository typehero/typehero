'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import type { InfiniteReports } from '../report/[id]/_components/report/report.action';
import type { BannedUsers, UploadedImages } from './admin.actions';
import React from 'react';
import Reports from './reports';
import { BannedUsers as BannedUserComponent } from './users';
import { ChallengeReviews } from './challenge-reviews';
import { ImageUploadReport } from './images';
import { ManageTracks } from './tracks';

interface Props {
  reports: InfiniteReports;
  allBannedUsers: BannedUsers;
  uploadedImages: UploadedImages;
}

export function TabView({ reports, allBannedUsers, uploadedImages }: Props) {
  const defaultTab = 'reports';
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
          <Tabs className="space-x-4" defaultValue={defaultTab}>
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
              <TabsTrigger className="data-[state=active]:bg-border duration-300" value="users">
                Users
              </TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-border duration-300" value="images">
                Images
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-border rounded-l-lg rounded-r-2xl duration-300"
                value="tracks"
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
