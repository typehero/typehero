import Image from 'next/image';
import type { User } from '@repo/db/types';
import Link from 'next/link';
import { getServerAuthSession } from '@repo/auth/server';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { prisma } from '@repo/db';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  VerticalTabsContent,
  VerticalTabsTrigger,
  MagicIcon,
  VerticalTabsList,
} from '@repo/ui';
import { Overview } from './overview';
import { InProgressTab } from './in-progress-tab';
import { SolutionsTab } from './solutions-tab';
import UserHeader from './user-header';
import { getRelativeTime } from '~/utils/relativeTime';
import { stripProtocolAndWWW } from '~/utils/stringUtils';
import { Play, Settings } from 'lucide-react';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export type UserData = NonNullable<Awaited<ReturnType<typeof getUserdata>>>;
async function getUserdata(id: string) {
  const userData = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
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

export default async function Dashboard({ user }: Props) {
  const userData = await getUserdata(user.id);
  const session = await getServerAuthSession();

  // TODO: this seems sus
  if (!userData) {
    return null;
  }

  return (
    <div className="container">
      <div className="mt-10">
        <div className="max-w-md">
          <ReactMarkdown>{user.bio}</ReactMarkdown>
        </div>

        {user.userLinks.length > 0 && (
          <div>
            {user.userLinks
              .filter((item) => item.url !== '')
              .map((link) => (
                <div className="flex gap-2" key={link.id}>
                  <MagicIcon url={link.url} />
                  <a
                    className="hover:text-zinc-400"
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

        <Tabs className="flex flex-row gap-10" defaultValue="in-progress">
          <VerticalTabsList>
            <div className="flex flex-col items-center justify-center">
              <Image
                alt="user avatar"
                className="rounded-3xl"
                height="100"
                src={user.image ?? '/avatar.jpeg'}
                width="100"
              />
              <UserHeader user={user} isOwnProfile={session?.user.id === user.id} />
              <p
                className="text-sm italic tracking-tight"
                title={`Joined ${user.createdAt.toString()}`}
              >
                Joined {getRelativeTime(user.createdAt)}
              </p>
            </div>
            <div>
              {session?.user.id === user.id && (
                <div className='px-4 flex gap-2 border-border dark:border-ring border data-[state=active]:bg-border p-2 duration-300 focus-visible:ring-offset-2 rounded-3xl ring-offset-background focus-visible:ring-ring data-[state=active]:text-foreground whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm'>
                  <Settings width={18} height={18} />
                  <Link href="/settings">
                      Settings
                  </Link>
                  </div>
              )}
            </div>
            <VerticalTabsTrigger className="px-4 flex gap-2" value="in-progress">
              <Play width={18} height={18} />
              <div className=''>In-Progress</div>
            </VerticalTabsTrigger>
            <VerticalTabsTrigger className='px-4 flex gap-2' value="solutions">Solutions</VerticalTabsTrigger>
            <VerticalTabsTrigger className='px-4 flex gap-2' disabled value="bookmarks">
              Bookmarks
            </VerticalTabsTrigger>
            <VerticalTabsTrigger className="px-4 flex gap-2" disabled value="comments">
              Comments
            </VerticalTabsTrigger>
          </VerticalTabsList>
          <VerticalTabsContent className="shrink grow space-y-4" value="overview">
            <div className="">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
            </div>
          </VerticalTabsContent>
          <VerticalTabsContent className="shrink grow space-y-4" value="in-progress">
            <div className="">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>In-Progress</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <InProgressTab />
                </CardContent>
              </Card>
            </div>
          </VerticalTabsContent>
          <VerticalTabsContent className="shrink grow space-y-4" value="solutions">
            <div className="">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Solutions</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <SolutionsTab submissions={userData.submission} />
                </CardContent>
              </Card>
            </div>
          </VerticalTabsContent>
        </Tabs>
      </div>
    </div>
  );
}
