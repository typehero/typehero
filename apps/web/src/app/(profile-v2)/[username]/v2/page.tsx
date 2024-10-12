import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { ProgressChart } from './_components/progress-chart';
import { SharedSolutionCard } from './_components/shared-solution-card';
import { Button } from '@repo/ui/components/button';
import { ArrowUpRight, Github, Twitter } from '@repo/ui/icons';
import Link from 'next/link';
import { ActivityChart } from './_components/activity-chart';
import { getWeek, startOfWeek, eachDayOfInterval, subDays, getDay, getMonth } from 'date-fns';
import { getBadges } from '~/app/(profile)/[username]/_components/dashboard/_actions';
import { cn } from '@repo/ui/cn';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/avatar';
import { Titles } from '~/app/challenge/_components/comments/enhanced-user-badge';
import {
  getTitles,
  getGradient,
} from '~/app/challenge/_components/comments/enhanced-user-badge.getTitles';
import { getRelativeTime } from '~/utils/relativeTime';
import { CardContent, CardHeader } from '@repo/ui/components/card';
import { Badges, EmptyBadge } from './_components/badges';
import { CardWithRadialBg } from './_components/card-radial-bg';
import { MovingGrid } from './_components/moving-grid';
import { getProgressData, getUserActivity } from './user-info';
import { auth } from '~/server/auth';

const hardcodedGitHubActivity = [
  {
    date: '2023-07-23',
    day: 0,
    week: 30,
    month: 6,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-07-24',
    day: 1,
    week: 30,
    month: 6,
    comments: 3,
    badges: 0,
    submissions: 1,
    activity: 4,
  },
  {
    date: '2023-07-25',
    day: 2,
    week: 30,
    month: 6,
    comments: 4,
    badges: 1,
    submissions: 4,
    activity: 9,
  },
  {
    date: '2023-07-26',
    day: 3,
    week: 30,
    month: 6,
    comments: 2,
    badges: 0,
    submissions: 3,
    activity: 5,
  },
  {
    date: '2023-07-27',
    day: 4,
    week: 30,
    month: 6,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-07-28',
    day: 5,
    week: 30,
    month: 6,
    comments: 0,
    badges: 0,
    submissions: 1,
    activity: 1,
  },
  {
    date: '2023-07-29',
    day: 6,
    week: 30,
    month: 6,
    comments: 2,
    badges: 0,
    submissions: 0,
    activity: 2,
  },
  {
    date: '2023-07-30',
    day: 0,
    week: 31,
    month: 6,
    comments: 4,
    badges: 0,
    submissions: 2,
    activity: 6,
  },
  {
    date: '2023-07-31',
    day: 1,
    week: 31,
    month: 6,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-01',
    day: 2,
    week: 31,
    month: 7,
    comments: 3,
    badges: 0,
    submissions: 3,
    activity: 6,
  },
  {
    date: '2023-08-02',
    day: 3,
    week: 31,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-03',
    day: 4,
    week: 31,
    month: 7,
    comments: 0,
    badges: 1,
    submissions: 4,
    activity: 5,
  },
  {
    date: '2023-08-04',
    day: 5,
    week: 31,
    month: 7,
    comments: 2,
    badges: 0,
    submissions: 0,
    activity: 2,
  },

  // Consecutive high activity days
  {
    date: '2023-08-05',
    day: 6,
    week: 31,
    month: 7,
    comments: 4,
    badges: 0,
    submissions: 3,
    activity: 7,
  },
  {
    date: '2023-08-06',
    day: 0,
    week: 32,
    month: 7,
    comments: 3,
    badges: 1,
    submissions: 2,
    activity: 6,
  },
  {
    date: '2023-08-07',
    day: 1,
    week: 32,
    month: 7,
    comments: 5,
    badges: 0,
    submissions: 4,
    activity: 9,
  },
  {
    date: '2023-08-08',
    day: 2,
    week: 32,
    month: 7,
    comments: 2,
    badges: 0,
    submissions: 3,
    activity: 5,
  },

  // Sparse activity
  {
    date: '2023-08-09',
    day: 3,
    week: 32,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-10',
    day: 4,
    week: 32,
    month: 7,
    comments: 1,
    badges: 0,
    submissions: 2,
    activity: 3,
  },
  {
    date: '2023-08-11',
    day: 5,
    week: 32,
    month: 7,
    comments: 1,
    badges: 1,
    submissions: 0,
    activity: 2,
  },
  {
    date: '2023-08-12',
    day: 6,
    week: 32,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },

  // Another series of active days
  {
    date: '2023-08-13',
    day: 0,
    week: 33,
    month: 7,
    comments: 4,
    badges: 0,
    submissions: 4,
    activity: 8,
  },
  {
    date: '2023-08-14',
    day: 1,
    week: 33,
    month: 7,
    comments: 3,
    badges: 1,
    submissions: 3,
    activity: 7,
  },
  {
    date: '2023-08-15',
    day: 2,
    week: 33,
    month: 7,
    comments: 2,
    badges: 0,
    submissions: 2,
    activity: 4,
  },
  {
    date: '2023-08-16',
    day: 3,
    week: 33,
    month: 7,
    comments: 5,
    badges: 0,
    submissions: 3,
    activity: 8,
  },

  // Some more gaps
  {
    date: '2023-08-17',
    day: 4,
    week: 33,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-18',
    day: 5,
    week: 33,
    month: 7,
    comments: 1,
    badges: 0,
    submissions: 1,
    activity: 2,
  },
  {
    date: '2023-08-19',
    day: 6,
    week: 33,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 3,
    activity: 3,
  },

  // Rest of the sparse days
  {
    date: '2023-08-20',
    day: 0,
    week: 34,
    month: 7,
    comments: 1,
    badges: 0,
    submissions: 0,
    activity: 1,
  },
  {
    date: '2023-08-21',
    day: 1,
    week: 34,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-22',
    day: 2,
    week: 34,
    month: 7,
    comments: 2,
    badges: 1,
    submissions: 3,
    activity: 6,
  },
  {
    date: '2023-08-23',
    day: 3,
    week: 34,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 1,
    activity: 1,
  },
  {
    date: '2023-08-24',
    day: 4,
    week: 34,
    month: 7,
    comments: 3,
    badges: 0,
    submissions: 0,
    activity: 3,
  },
  {
    date: '2023-08-25',
    day: 5,
    week: 34,
    month: 7,
    comments: 1,
    badges: 0,
    submissions: 1,
    activity: 2,
  },

  // Final stretch
  {
    date: '2023-08-26',
    day: 6,
    week: 34,
    month: 7,
    comments: 0,
    badges: 1,
    submissions: 0,
    activity: 1,
  },
  {
    date: '2023-08-27',
    day: 0,
    week: 35,
    month: 7,
    comments: 3,
    badges: 0,
    submissions: 2,
    activity: 5,
  },
  {
    date: '2023-08-28',
    day: 1,
    week: 35,
    month: 7,
    comments: 2,
    badges: 0,
    submissions: 3,
    activity: 5,
  },
  {
    date: '2023-08-29',
    day: 2,
    week: 35,
    month: 7,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-08-30',
    day: 3,
    week: 35,
    month: 7,
    comments: 0,
    badges: 1,
    submissions: 1,
    activity: 2,
  },
  {
    date: '2023-08-31',
    day: 4,
    week: 35,
    month: 7,
    comments: 4,
    badges: 0,
    submissions: 2,
    activity: 6,
  },
  {
    date: '2023-09-01',
    day: 5,
    week: 35,
    month: 8,
    comments: 2,
    badges: 0,
    submissions: 0,
    activity: 2,
  },
  {
    date: '2023-09-02',
    day: 6,
    week: 35,
    month: 8,
    comments: 1,
    badges: 0,
    submissions: 2,
    activity: 3,
  },
  {
    date: '2023-09-03',
    day: 0,
    week: 36,
    month: 8,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-09-04',
    day: 1,
    week: 36,
    month: 8,
    comments: 2,
    badges: 1,
    submissions: 1,
    activity: 4,
  },
  {
    date: '2023-09-05',
    day: 2,
    week: 36,
    month: 8,
    comments: 3,
    badges: 0,
    submissions: 4,
    activity: 7,
  },
  {
    date: '2023-09-06',
    day: 3,
    week: 36,
    month: 8,
    comments: 0,
    badges: 1,
    submissions: 1,
    activity: 2,
  },
  {
    date: '2023-09-07',
    day: 4,
    week: 36,
    month: 8,
    comments: 1,
    badges: 1,
    submissions: 0,
    activity: 2,
  },
  {
    date: '2023-09-08',
    day: 5,
    week: 36,
    month: 8,
    comments: 4,
    badges: 0,
    submissions: 3,
    activity: 7,
  },
  {
    date: '2023-09-09',
    day: 6,
    week: 36,
    month: 8,
    comments: 1,
    badges: 0,
    submissions: 2,
    activity: 3,
  },
  {
    date: '2023-09-10',
    day: 0,
    week: 37,
    month: 8,
    comments: 0,
    badges: 1,
    submissions: 0,
    activity: 1,
  },
  {
    date: '2023-09-11',
    day: 1,
    week: 37,
    month: 8,
    comments: 2,
    badges: 0,
    submissions: 3,
    activity: 5,
  },
  {
    date: '2023-09-12',
    day: 2,
    week: 37,
    month: 8,
    comments: 3,
    badges: 1,
    submissions: 1,
    activity: 5,
  },
  {
    date: '2023-09-13',
    day: 3,
    week: 37,
    month: 8,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-09-14',
    day: 4,
    week: 37,
    month: 8,
    comments: 1,
    badges: 0,
    submissions: 2,
    activity: 3,
  },
  {
    date: '2023-09-15',
    day: 5,
    week: 37,
    month: 8,
    comments: 4,
    badges: 0,
    submissions: 3,
    activity: 7,
  },
  {
    date: '2023-09-16',
    day: 6,
    week: 37,
    month: 8,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-09-17',
    day: 0,
    week: 38,
    month: 8,
    comments: 1,
    badges: 1,
    submissions: 2,
    activity: 4,
  },
  {
    date: '2023-09-18',
    day: 1,
    week: 38,
    month: 8,
    comments: 3,
    badges: 0,
    submissions: 0,
    activity: 3,
  },
  {
    date: '2023-09-19',
    day: 2,
    week: 38,
    month: 8,
    comments: 0,
    badges: 0,
    submissions: 1,
    activity: 1,
  },
  {
    date: '2023-09-20',
    day: 3,
    week: 38,
    month: 8,
    comments: 2,
    badges: 0,
    submissions: 2,
    activity: 4,
  },
  {
    date: '2023-09-21',
    day: 4,
    week: 38,
    month: 8,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-09-22',
    day: 5,
    week: 38,
    month: 8,
    comments: 4,
    badges: 1,
    submissions: 3,
    activity: 8,
  },
  {
    date: '2023-09-23',
    day: 6,
    week: 38,
    month: 8,
    comments: 1,
    badges: 0,
    submissions: 1,
    activity: 2,
  },
  {
    date: '2023-09-24',
    day: 0,
    week: 39,
    month: 8,
    comments: 2,
    badges: 0,
    submissions: 0,
    activity: 2,
  },
  {
    date: '2023-09-25',
    day: 1,
    week: 39,
    month: 9,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
  {
    date: '2023-09-26',
    day: 2,
    week: 39,
    month: 9,
    comments: 3,
    badges: 1,
    submissions: 2,
    activity: 6,
  },
  {
    date: '2023-09-27',
    day: 3,
    week: 39,
    month: 9,
    comments: 0,
    badges: 0,
    submissions: 0,
    activity: 0,
  },
];

export function generateSampleData() {
  const endDate = new Date();
  // endDate.setDate(4);
  const startDate = startOfWeek(subDays(endDate, 60), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
    const comments = Math.floor(Math.random() * 5);
    const badges = Math.floor(Math.random() * 2);
    const submissions = Math.floor(Math.random() * 5);
    const activity = comments + badges + submissions;
    return {
      date,
      day: getDay(date),
      week: getWeek(date),
      month: getMonth(date),
      comments,
      badges,
      submissions,
      activity,
    };
  });
  return hardcodedGitHubActivity.map((r) => ({ ...r, date: new Date(r.date) }));
}

export default async function ProfilePage(props: { params: { username: string } }) {
  const [, username] = decodeURIComponent(props.params.username).split('@');
  if (username === undefined) {
    notFound();
  }
  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
    select: {
      id: true,
      bio: true,
      name: true,
      image: true,
      roles: true,
      createdAt: true,
      sharedSolution: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          _count: {
            select: {
              vote: true,
              solutionComment: true,
            },
          },
          isPinned: true,
          challenge: {
            select: {
              name: true,
              difficulty: true,
            },
          },
        },
      },
    },
  });
  if (user === null) {
    notFound();
  }
  const badges = await getBadges(user.id);
  const titles = getTitles(user.roles);
  const gradient = getGradient(user.roles);
  const progressData = await getProgressData(user.id);
  const activityData = await getUserActivity(user.id);

  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="container space-y-8 pt-16">
      <MovingGrid>
        <div className="relative flex flex-row items-start justify-between">
          <div className="flex h-full flex-col justify-center space-y-3">
            <div className="flex flex-row items-end space-x-4">
              <Avatar className="z-10 h-56 w-56 rounded-lg transition group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-1">
                <AvatarImage src={user.image ?? ''} alt={`${user.name} profile picture`} />
                <AvatarFallback className="rounded-lg capitalize">
                  {user.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-56 flex flex-col space-y-2">
                <h1
                  className={cn(
                    'w-min bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent',
                    gradient,
                  )}
                >
                  {user.name}
                </h1>
                <Titles data={titles} />
                <h2 className="text-muted-foreground text-sm tracking-tight">
                  Joined {getRelativeTime(user.createdAt)}
                </h2>
                <div className="flex flex-row space-x-1">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Twitter className="h-7 w-7" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Github className="h-7 w-7" />
                  </Button>
                </div>
              </div>
            </div>
            {user.bio === '' && isOwnProfile ? (
              <div className="space-y-3 p-4">
                <h1 className="text-center">
                  ? 'You haven’t added a bio yet—tell others a bit about yourself!'
                </h1>
                <Button asChild variant="outline" className="text-center">
                  <Link href="./v2/all">Update your bio</Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-[60ch]">
                <p className="leading-7 tracking-tight">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="h-fit items-center">
            <ProgressChart
              totalCompleted={progressData.totalSolved}
              chartData={progressData.chartData}
            />
          </div>
        </div>
      </MovingGrid>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-8">
        <CardWithRadialBg className="col-span-3">
          <div className="flex h-full flex-col">
            <CardHeader>
              <Button
                asChild
                size="xs"
                variant="link"
                className="text-muted-foreground hover:text-primary w-fit text-lg "
              >
                <Link href="./v2/completed">
                  Shared Solutions
                  <ArrowUpRight className="ml-1 h-4 w-4 " />
                </Link>
              </Button>
            </CardHeader>

            {user.sharedSolution.length === 0 ? (
              <CardContent className="flex h-full w-full grow flex-col items-center justify-center space-y-3 px-16">
                <h1 className="text-center">
                  {isOwnProfile
                    ? "It looks like you haven't shared any solutions yet."
                    : `It looks like @${username} hasn't shared any solutions yet.`}
                </h1>
                {isOwnProfile ? (
                  <Button asChild variant="link" className="text-center">
                    <Link href="./v2/all">Explore completed solutions and share your own!</Link>
                  </Button>
                ) : null}
              </CardContent>
            ) : (
              <CardContent className="flex flex-col space-y-2">
                {user.sharedSolution.map((s) => (
                  <SharedSolutionCard
                    key={s.id}
                    solution={{
                      isPinned: s.isPinned,
                      voteCount: s._count.vote,
                      commentCount: s._count.solutionComment,
                      challenge: {
                        name: s.challenge?.name ?? '',
                        difficulty: s.challenge?.difficulty ?? 'EASY',
                      },
                    }}
                  />
                ))}
              </CardContent>
            )}
          </div>
        </CardWithRadialBg>

        <CardWithRadialBg className="col-span-2 ">
          <div className="flex h-full flex-col">
            <CardHeader>
              <h1 className="text-muted-foreground pl-2 text-lg tracking-wide">Badges</h1>
            </CardHeader>
            {badges.length === 0 ? (
              <CardContent className="flex h-full w-full grow flex-col items-center justify-center space-y-3  ">
                <h1 className="text-center">
                  {isOwnProfile
                    ? "You haven't earned a badge yet - keep going, you're close!"
                    : `@${username} is yet to discover an achievement !`}
                </h1>
                <div className="mx-auto grid w-fit grid-cols-3 gap-4  ">
                  {Array.from({ length: 6 }).map((i) => (
                    <EmptyBadge key={`empty-badge-${i}`} />
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <Badges data={badges} />
              </CardContent>
            )}
          </div>
        </CardWithRadialBg>

        <CardWithRadialBg className="col-span-3 h-fit w-fit">
          <CardHeader>
            <h1 className="text-muted-foreground pl-2 text-lg tracking-wide">Recent Activity</h1>
          </CardHeader>
          <CardContent>
            <ActivityChart data={activityData} />
          </CardContent>
        </CardWithRadialBg>
      </div>
    </div>
  );
}

/* To be used when we have stats in the future */
/* function StatCard(props: { title: string; data: string; secondaryData?: string }) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-muted-foreground tracking-tight">{props.title}</h1>
      <div className="flex flex-row items-baseline space-x-1.5">
        <p className="text-4xl font-bold">{props.data}</p>
        {props.secondaryData !== undefined ? <p>{props.secondaryData}</p> : null}
      </div>
    </div>
  );
} */
