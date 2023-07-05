import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Overview } from '~/components/dashboard/overview';
import { InProgressTab } from '~/components/dashboard/in-progress-tab-mock';
import { SolutionsTab } from '~/components/dashboard/solutions-tab-mock';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
};

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Image
              className="rounded-3xl"
              alt="user avatar"
              width="100"
              height="100"
              src="/avatar.jpeg"
            />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">Username</p>
            <p className="text-sm italic tracking-tight">Joined: 07/03/2023</p>
            <p className="text-sm italic tracking-tight">Challenges Complete: 5</p>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="rounded-full border border-border bg-background">
            <TabsTrigger
              className="rounded-l-2xl rounded-r-lg duration-300 data-[state=active]:bg-border"
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="rounded-lg duration-300 data-[state=active]:bg-border"
              value="in-progress"
            >
              In-Progress
            </TabsTrigger>
            <TabsTrigger
              className="rounded-lg duration-300 data-[state=active]:bg-border"
              value="solutions"
            >
              Solutions
            </TabsTrigger>
            <TabsTrigger
              className="rounded-lg duration-300 data-[state=active]:bg-border"
              value="bookmarks"
              disabled
            >
              Bookmarks
            </TabsTrigger>
            <TabsTrigger
              className="rounded-l-lg rounded-r-full duration-300 data-[state=active]:bg-border"
              value="comments"
              disabled
            >
              Comments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>In-Progress</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <InProgressTab />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="solutions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Solutions</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <SolutionsTab />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
