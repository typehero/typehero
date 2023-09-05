import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { User } from '@repo/db/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  MagicIcon,
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@repo/ui';
import { Bookmark, ChevronRightSquare, MessagesSquare, Play, Settings } from '@repo/ui/icons';
import Link from 'next/link';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { getRelativeTime } from '~/utils/relativeTime';
import { stripProtocolAndWWW } from '~/utils/stringUtils';
import { InProgressTab } from './in-progress-tab';
import { Overview } from './overview';
import { SolutionsTab } from './solutions-tab';
import UserHeader from './user-header';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
}

export type UserData = NonNullable<Awaited<ReturnType<typeof getUserdata>>>;
async function getUserdata(id: string) {
  const userData = await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      submission: {
        where: {
          userId: id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        take: 10,
        include: {
          challenge: true,
        },
      },
    },
  });

  return userData;
}

export async function Dashboard({ user }: Props) {
  const userData = await getUserdata(user.id);
  const session = await getServerAuthSession();

  // TODO: this seems sus
  if (!userData) {
    return null;
  }

  return (
    <div className="container">
      {/* // TODO: GFI: make each page a subroute, put settings into this same layout */}
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="in-progress">
        <VerticalTabsList>
          <div className="mb-2 flex flex-col items-center md:items-start">
            <div
              className="mb-10 h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <UserHeader user={user} isOwnProfile={session?.user.id === user.id} />
            <p
              className="text-sm italic tracking-tight text-neutral-500"
              title={`Joined ${user.createdAt.toString()}`}
            >
              Joined {getRelativeTime(user.createdAt)}
            </p>
            <div className="mb-4 mt-2 w-full text-center text-sm md:w-64 md:text-start">
              <ReactMarkdown>{user.bio}</ReactMarkdown>
            </div>

            {user.userLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                {user.userLinks
                  .filter((item) => item.url !== '')
                  .map((link) => (
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
          </div>
          <div className="flex gap-4 pr-6 md:flex-col">
            <VerticalTabsTrigger
              className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
              value="in-progress"
            >
              <Play className="h-4 w-4" />
              <span className="hidden md:block">In-Progress</span>
            </VerticalTabsTrigger>
            <VerticalTabsTrigger
              className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
              value="solutions"
            >
              <ChevronRightSquare className="h-4 w-4" />
              <span className="hidden md:block">Solutions</span>
            </VerticalTabsTrigger>
            <VerticalTabsTrigger
              className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
              disabled
              value="bookmarks"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:block">Bookmarks</span>
            </VerticalTabsTrigger>
            <VerticalTabsTrigger
              className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
              disabled
              value="comments"
            >
              <MessagesSquare className="h-4 w-4" />
              <span className="hidden md:block">Comments</span>
            </VerticalTabsTrigger>
            <div>
              {session?.user.id === user.id && (
                <Link
                  href="/settings"
                  className="border-border dark:border-ring data-[state=active]:bg-border ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground flex items-center justify-center gap-3 whitespace-nowrap rounded-xl border px-1.5 py-1.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm md:justify-normal md:px-3"
                >
                  <Settings width={18} height={18} />
                  <span className="hidden md:block">Settings</span>
                </Link>
              )}
            </div>
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value="overview">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="in-progress">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>In-Progress</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <InProgressTab />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="solutions">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Solutions</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <SolutionsTab submissions={userData.submission} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
}
