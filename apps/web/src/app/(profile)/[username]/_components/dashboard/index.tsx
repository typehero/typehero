'use client';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import type { User } from '@repo/db/types';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import {
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@repo/ui/components/tabs';
import { Bookmark, CheckCircle, ChevronRightSquare, Play, Settings, Text } from '@repo/ui/icons';

import { getRelativeTime } from '~/utils/relativeTime';
import { stripProtocolAndWWW } from '~/utils/stringUtils';

import { type BadgeInfo } from './_actions';
import { Badges } from './badges';
import UserHeader from './user-header';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
  isOwnProfile: boolean;
  badges: BadgeInfo[];
  children: React.ReactNode;
}
type Tab = 'bookmarks' | 'completed' | 'in-progress' | 'overview' | 'shared-solutions';

export function Dashboard({ user, isOwnProfile, badges, children }: Props) {
  const router = useRouter();

  const tabs = useMemo(
    () => [
      { name: 'overview', route: `/@${user.name}` },
      { name: 'in-progress', route: `/@${user.name}/in-progress` },
      { name: 'shared-solutions', route: `/@${user.name}/shared-solutions` },
      { name: 'bookmarks', route: `/@${user.name}/bookmarks` },
      { name: 'completed', route: `@${user.name}/completed` },
    ],
    [user.name],
  );

  const filteredProfileLinks =
    user.userLinks.length > 0 ? user.userLinks.filter((item) => item.url !== '') : [];

  const pathname = usePathname();
  const selectedTab: Tab = useMemo(() => {
    const splitPath = pathname.split('/');

    if (splitPath.includes('in-progress')) {
      return 'in-progress';
    }

    if (splitPath.includes('shared-solutions')) {
      return 'shared-solutions';
    }

    if (splitPath.includes('bookmarks')) {
      return 'bookmarks';
    }

    if (splitPath.includes('completed')) {
      return 'completed';
    }

    return 'overview';
  }, [pathname]);

  useEffect(() => {
    // prefetch every route except for the one we're currently in
    tabs.forEach((tab) => {
      if (selectedTab !== tab.name) {
        router.prefetch(tab.route);
      }
    });
  }, [router, selectedTab, tabs]);

  return (
    <div className="container">
      {/* // TODO: GFI: make each page a subroute, put settings & profile into same layout */}
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" value={selectedTab}>
        <VerticalTabsList>
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div
              className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
              <UserHeader user={user} isOwnProfile={isOwnProfile} />
              <span
                className="text-muted-foreground tracking-tight"
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
                      className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
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
                className="flex items-center justify-center gap-3 px-2 hover:bg-neutral-200/50 md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                value="overview"
                onClick={() => {
                  router.push(`/@${user.name}`);
                }}
              >
                <Text className="h-4 w-4" />
                <span className="hidden md:block">Overview</span>
              </VerticalTabsTrigger>
              {Boolean(isOwnProfile) && (
                <VerticalTabsTrigger
                  className="flex items-center justify-center gap-3 px-2 hover:bg-neutral-200/50 md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                  value="completed"
                  onClick={() => {
                    router.push(`/@${user.name}/completed`);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden md:block">Completed</span>
                </VerticalTabsTrigger>
              )}
              {Boolean(isOwnProfile) && (
                <VerticalTabsTrigger
                  className="flex items-center justify-center gap-3 px-2 hover:bg-neutral-200/50 md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                  value="in-progress"
                  onClick={() => {
                    router.push(`/@${user.name}/in-progress`);
                  }}
                >
                  <Play className="h-4 w-4" />
                  <span className="hidden md:block">In-Progress</span>
                </VerticalTabsTrigger>
              )}
              <VerticalTabsTrigger
                className="flex items-center justify-center gap-3 px-2 hover:bg-neutral-200/50 md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                value="shared-solutions"
                onClick={() => {
                  router.push(`/@${user.name}/shared-solutions`);
                }}
              >
                <ChevronRightSquare className="h-4 w-4" />
                <span className="hidden md:block">Shared Solutions</span>
              </VerticalTabsTrigger>
              {Boolean(isOwnProfile) && (
                <>
                  <VerticalTabsTrigger
                    className="flex items-center justify-center gap-3 px-2 hover:bg-neutral-200/50 md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                    value="bookmarks"
                    onClick={() => {
                      router.push(`/@${user.name}/bookmarks`);
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden md:block">Bookmarks</span>
                  </VerticalTabsTrigger>
                  <Link
                    href="/settings"
                    className="border-border dark:border-ring data-[state=active]:bg-border ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground flex items-center justify-center gap-3 whitespace-nowrap rounded-xl border px-1.5 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-neutral-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm md:justify-normal md:px-3 dark:hover:bg-neutral-700/50"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:block">Settings</span>
                  </Link>
                </>
              )}
            </div>
            <Badges className="flex w-full flex-1" badges={badges} />
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value={selectedTab}>
          {children}
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
}
