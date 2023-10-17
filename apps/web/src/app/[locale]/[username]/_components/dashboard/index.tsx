import Link from 'next/link';

import { getServerAuthSession } from '@repo/auth/server';
import type { User } from '@repo/db/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@repo/ui/components/card';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import {
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@repo/ui/components/tabs';
import { Bookmark, ChevronRightSquare, Play, Settings, Text } from '@repo/ui/icons';

import { getRelativeTime } from '~/utils/relativeTime';
import { stripProtocolAndWWW } from '~/utils/stringUtils';

import { BookmarksTab } from './bookmarks-tab';
import { InProgressTab } from './in-progress-tab';
import { OverviewTab } from './overview-tab';
import { SharedSolutionsTab } from './shared-solutions-tab';
import UserHeader from './user-header';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
}

export async function Dashboard({ user }: Props) {
  const session = await getServerAuthSession();

  const isOwnProfile = session?.user.id === user.id;

  const filteredProfileLinks =
    user.userLinks.length > 0 ? user.userLinks.filter((item) => item.url !== '') : [];

  return (
    <div className="container">
      {/* // TODO: GFI: make each page a subroute, put settings into this same layout */}
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="overview">
        <VerticalTabsList>
          <div className="flex flex-col items-center gap-10 md:items-start">
            <div
              className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
              <UserHeader user={user} isOwnProfile={isOwnProfile} />
              <span
                className="text-muted-foreground text-sm italic tracking-tight"
                title={`Joined ${user.createdAt.toString()}`}
              >
                Joined {getRelativeTime(user.createdAt)}
              </span>
            </div>
            {Boolean(filteredProfileLinks.length > 0) && (
              <div className="flex w-full flex-col items-center gap-2 md:items-start">
                {filteredProfileLinks.map((link) => (
                  <div className="flex items-center gap-2" key={link.id}>
                    <MagicIcon url={link.url} />
                    <a
                      className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
                      href={link.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {stripProtocolAndWWW(link.url)}
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-4 md:w-full md:flex-col">
              <VerticalTabsTrigger
                className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                value="overview"
              >
                <Text className="h-4 w-4" />
                <span className="hidden md:block">Overview</span>
              </VerticalTabsTrigger>
              {Boolean(isOwnProfile) && (
                <VerticalTabsTrigger
                  className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                  value="in-progress"
                >
                  <Play className="h-4 w-4" />
                  <span className="hidden md:block">In-Progress</span>
                </VerticalTabsTrigger>
              )}
              <VerticalTabsTrigger
                className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                value="shared-solutions"
              >
                <ChevronRightSquare className="h-4 w-4" />
                <span className="hidden md:block">Shared Solutions</span>
              </VerticalTabsTrigger>
              {Boolean(isOwnProfile) && (
                <>
                  <VerticalTabsTrigger
                    className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                    value="bookmarks"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden md:block">Bookmarks</span>
                  </VerticalTabsTrigger>
                  <Link
                    href="/settings"
                    className="border-border dark:border-ring data-[state=active]:bg-border ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground flex items-center justify-center gap-3 whitespace-nowrap rounded-xl border px-1.5 py-1.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm md:justify-normal md:px-3"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:block">Settings</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value="overview">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewTab user={user} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="in-progress">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>In-Progress</CardTitle>
              <CardDescription className="text-muted-foreground mb-4 text-sm">
                Your in-progress challenges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InProgressTab userId={user.id} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="shared-solutions">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Shared Solutions</CardTitle>
              <CardDescription className="text-muted-foreground mb-4 text-sm">
                {isOwnProfile ? 'Your' : `${user.name}'s`} shared challenge solutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SharedSolutionsTab userId={user.id} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="bookmarks">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Bookmarks</CardTitle>
              <CardDescription className="text-muted-foreground mb-4 text-sm">
                Your bookmarked challenges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookmarksTab userId={user.id} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
}
