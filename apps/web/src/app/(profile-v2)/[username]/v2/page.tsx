import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { ProgressChart } from './_components/progress-chart';
import { SharedSolutionCard } from './_components/shared-solution-card';
import { Button } from '@repo/ui/components/button';
import { ArrowUpRight } from '@repo/ui/icons';
import Link from 'next/link';
import { ActivityChart2 } from './_components/activity-chart-v2';
import { startOfWeek, eachDayOfInterval, subDays, getDay, getMonth } from 'date-fns';
import { getWeek } from 'date-fns/esm';
import { ActivityChart } from './_components/activity-chart';

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
          {/* <ActivityChart days={generateSampleData()} /> */}
          <ActivityChart2 data={generateSampleData()} />
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
