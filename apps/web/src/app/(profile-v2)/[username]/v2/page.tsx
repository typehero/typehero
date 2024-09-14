import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { ProgressChart } from './_components/progress-chart';
import { SharedSolutionCard } from './_components/shared-solution-card';
import { ActivityChart, generateSampleData } from './_components/activity-chart';
import { Feed, generateFeedDate } from './_components/feed';
import { Button } from '@repo/ui/components/button';
import { ArrowUpRight } from '@repo/ui/icons';
import { Separator } from '@repo/ui/components/separator';
import Link from 'next/link';

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
    },
  });
  if (user === null) {
    notFound();
  }

  return (
    <div className="flex flex-col space-y-10">
      <div className="space-y-2">
        <div className="flex w-full flex-row justify-between">
          <h1 className="text-muted-foreground text-lg tracking-wide ">Challenge Progress</h1>
          <Button
            asChild
            size="xs"
            variant="link"
            className="text-muted-foreground hover:text-primary"
          >
            <Link href="./v2/completed">
              view completed challenges
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex h-fit w-full flex-row space-x-5">
          <ProgressChart completed={50} max={100} difficulty="Beginner" />
          <ProgressChart completed={80} max={100} difficulty="Easy" />
          <ProgressChart completed={100} max={100} difficulty="Medium" />
          <ProgressChart completed={69} max={100} difficulty="Hard" />
          <ProgressChart completed={42} max={100} difficulty="Expert" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex w-full flex-row justify-between">
          <h1 className="text-muted-foreground text-lg tracking-wide ">Shared Solutions</h1>
          <Button
            asChild
            size="xs"
            variant="link"
            className="text-muted-foreground hover:text-primary"
          >
            <Link href="./v2/shared-solutions">
              view all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex w-fit flex-row space-x-6">
          <SharedSolutionCard
            solution={{
              isPinned: true,
              voteCount: 10,
              commentCount: 6,
              challenge: {
                name: 'Awaited',
                difficulty: 'MEDIUM',
              },
            }}
          />
          <SharedSolutionCard
            solution={{
              isPinned: true,
              voteCount: 10,
              commentCount: 6,
              challenge: {
                name: 'Awaited',
                difficulty: 'MEDIUM',
              },
            }}
          />
          <SharedSolutionCard
            solution={{
              isPinned: true,
              voteCount: 10,
              commentCount: 6,
              challenge: {
                name: 'Awaited',
                difficulty: 'MEDIUM',
              },
            }}
          />
        </div>
      </div>

      <div className="flex flex-row space-x-5">
        <div className="w-full space-y-2">
          <h1 className="text-muted-foreground text-lg tracking-wide ">Stats</h1>
          <div className="grid grid-cols-2 justify-between gap-y-5">
            <StatCard title="Global Leaderboard Rank" data="1,567" />
            <StatCard title="Advent of Typescript 2024 Rank" data="1,567" />
            <StatCard title="Challenged Completed" data="97" secondaryData="/ 143" />
            <StatCard title="Max Submissions Streak" data="5" secondaryData="days" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-muted-foreground text-lg tracking-wide ">Recent Activity</h1>
          <ActivityChart days={generateSampleData()} />
        </div>
      </div>
    </div>
  );
}

function StatCard(props: { title: string; data: string; secondaryData?: string }) {
  return (
    <div className="space-y-0.5">
      <h1>{props.title}</h1>
      <div className="flex flex-row items-baseline space-x-1.5">
        <p className="text-4xl font-bold">{props.data}</p>
        {props.secondaryData !== undefined ? <p>{props.secondaryData}</p> : null}
      </div>
    </div>
  );
}
