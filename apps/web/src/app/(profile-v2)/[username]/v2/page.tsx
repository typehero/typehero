import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { ProgressChart } from './_components/progress-chart';
import { SharedSolutionCard } from './_components/shared-solution-card';
import { Button } from '@repo/ui/components/button';
import { ArrowUpRight, Github, Twitter } from '@repo/ui/icons';
import Link from 'next/link';
import { ActivityChart } from './_components/activity-chart';
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
import { MagicIcon } from '@repo/ui/components/magic-icon';

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
      userLinks: true,
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
  const sortedSharedSolutions = [...user.sharedSolution].sort((a, b) => (a.isPinned ? -1 : 1));
  // TODO: Change form to prevent it from adding empty links?
  const userLinks = user.userLinks.filter((u) => u.url !== '');

  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;
  return (
    <div className="px-2 pt-8 lg:px-0 lg:pt-10">
      <div className="flex flex-col space-y-6 lg:hidden">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-56 w-56 rounded-lg transition group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-1">
            <AvatarImage src={user.image ?? ''} alt={`${user.name} profile picture`} />
            <AvatarFallback className="rounded-lg capitalize">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center space-y-1">
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
            {user.bio === '' && isOwnProfile ? (
              <div className="flex flex-col justify-center p-4">
                <h1 className="text-center">
                  You haven’t added a bio yet—tell others a bit about yourself !
                </h1>
                <Button asChild variant="link" className="text-center" size="sm">
                  <Link href="./v2/all">Update your bio</Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-[60ch]">
                <p className="text-center tracking-tighter ">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <ProgressChart
            totalCompleted={progressData.totalSolved}
            chartData={progressData.chartData}
            totalChallenges={progressData.totalChallenges}
          />
        </div>
      </div>
      <MovingGrid className="hidden lg:block">
        <div className="relative flex flex-row flex-wrap items-start justify-between">
          <div className="flex h-full max-w-full flex-col justify-center space-y-3 lg:max-w-[50%]">
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
                  {userLinks.map((link) => (
                    <Button
                      key={link.id}
                      variant="ghost"
                      size="sm"
                      className="hover:border-border border border-transparent p-2 py-5 transition-colors hover:bg-transparent dark:hover:bg-transparent"
                    >
                      <MagicIcon
                        url={link.url}
                        className="text-foreground dark:text-foreground h-7 w-7"
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {user.bio === '' && isOwnProfile ? (
              <div className="p-4">
                <h1>You haven’t added a bio yet—tell others a bit about yourself !</h1>
                <Button asChild variant="link" className="px-0 " size="sm">
                  <Link href="./v2/all">Update your bio</Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-[60ch]">
                <p className="leading-7 tracking-tight">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="h-fit max-w-[50%] items-center">
            <ProgressChart
              totalCompleted={progressData.totalSolved}
              chartData={progressData.chartData}
              totalChallenges={progressData.totalChallenges}
            />
          </div>
        </div>
      </MovingGrid>

      <div className="mt-6 flex flex-wrap justify-center gap-5 lg:mt-8">
        <CardWithRadialBg className="min-h-[200px] max-w-sm basis-full md:basis-1/2 lg:basis-1/3">
          <div className="flex h-full flex-col">
            <CardHeader>
              <Button
                asChild
                size="xs"
                variant="link"
                className="text-muted-foreground hover:text-primary w-fit text-lg "
              >
                <Link href="./v2/shared-solutions">
                  Shared Solutions
                  <ArrowUpRight className="ml-1 h-4 w-4 " />
                </Link>
              </Button>
            </CardHeader>

            {sortedSharedSolutions.length === 0 ? (
              <CardContent className="flex h-full grow flex-col items-center justify-center space-y-3 lg:px-16">
                <h1 className="text-center">
                  {isOwnProfile
                    ? "It looks like you haven't shared any solutions yet."
                    : `It looks like @${username} hasn't shared any solutions yet.`}
                </h1>
                {isOwnProfile ? (
                  <Button asChild variant="link" className="text-center">
                    <Link href="./v2/completed">
                      Explore your completed solutions and share your own!
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            ) : (
              <CardContent className="pointer-events-auto flex flex-col space-y-2">
                {sortedSharedSolutions.map((s) => (
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

        <CardWithRadialBg className="max-w-sm basis-full md:basis-1/2 lg:basis-1/3">
          <div className="flex h-full flex-col">
            <CardHeader>
              <h1 className="text-muted-foreground pl-2 text-lg tracking-wide">Badges</h1>
            </CardHeader>
            {badges.length === 0 ? (
              <CardContent className="flex h-full w-full grow flex-col items-center justify-center space-y-3 lg:px-16">
                <h1 className="text-center md:px-4 lg:px-2">
                  {isOwnProfile
                    ? "You haven't earned a badge yet - keep going, you're close!"
                    : `@${username} is yet to discover an achievement`}
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

        <CardWithRadialBg className="h-fit max-w-sm basis-full md:basis-1/2 lg:basis-1/3">
          <CardHeader>
            <h1 className="text-muted-foreground pl-2 text-lg tracking-wide">Recent Activity</h1>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
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
