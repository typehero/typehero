import { Metadata } from 'next';
import Image from 'next/image';
import { Activity, CreditCard, DollarSign, Download, Users } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Overview } from '~/components/dashboard/overview';
import { RecentSales } from '~/components/dashboard/recent-sales';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app using the components.',
};

export default function DashboardPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Image alt="user avatar" width="100" height="100" src="/avatar.jpeg" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">Username</p>
            <p className="text-sm italic tracking-tight">Joined: 07/03/2023</p>
            <p className="text-sm italic tracking-tight">Challenges Complete: 5</p>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              In-Progress
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Solutions
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
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
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
