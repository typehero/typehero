import { prisma } from '@repo/db';
import { Prisma } from '@repo/db/types';
import { notFound } from 'next/navigation';
import { daysAfterDecemberFirst } from '~/utils/aot';
import { getAllFlags } from '~/utils/feature-flags';
import { AOT_CHALLENGES } from '../../challenge/[slug]/aot-slugs';
import { Hero } from './_components/hero';
import { LeastSolved } from './_components/least-solved';
import { MostSolved } from './_components/most-solved';
import { UserSummary } from './_components/user-summary';

export type StaticParams = Awaited<ReturnType<typeof generateStaticParams>>;
export async function generateStaticParams() {
  const totalNumberOfAccountsDuringAot = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date('2023-12-01T00:00:00.000Z'),
        lte: new Date('2023-12-25T23:59:59.999Z'),
      },
    },
  });
  const totalAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
    },
  });
  const incorrectAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: false,
    },
  });
  const correctAotSubmissions = await prisma.submission.count({
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: true,
    },
  });
  const topThreeSolved = await prisma.$queryRaw<AotChallengeData[]>`
    select name, slug, challengeId, count(T.userId) as userCount
    from(
      select DISTINCT challengeId, userId
      from Submission
      where isSuccessful = true
    ) as T
    LEFT JOIN Challenge ON Challenge.id = T.challengeId
    WHERE slug in (${Prisma.join(AOT_CHALLENGES.slice(0, -1))})
    group by challengeId, slug
    order by userCount desc
    limit 3
    `;

  const bottomThreeSolved = await prisma.$queryRaw<AotChallengeData[]>`
    select name, slug, challengeId, count(T.userId) as userCount
    from(
      select DISTINCT challengeId, userId
      from Submission
      where isSuccessful = true
    ) as T
    LEFT JOIN Challenge ON Challenge.id = T.challengeId
    WHERE slug in (${Prisma.join(AOT_CHALLENGES.slice(0, -1))})
    group by challengeId, slug
    order by userCount asc
    limit 3
    `;

  const top3 = topThreeSolved.map((r) => ({
    ...r,
    userCount: Number(r.userCount),
  }));

  const bottom3 = bottomThreeSolved.map((r) => ({
    ...r,
    userCount: Number(r.userCount),
  }));

  return {
    top3,
    bottom3,
    totalAotSubmissions,
    correctAotSubmissions,
    incorrectAotSubmissions,
    totalNumberOfAccountsDuringAot,
  };
}

export interface AotChallengeData {
  challengeId: string;
  name: string;
  slug: string;
  userCount: number;
}
export default async function Index({
  params: {
    top3,
    bottom3,
    totalAotSubmissions,
    correctAotSubmissions,
    incorrectAotSubmissions,
    totalNumberOfAccountsDuringAot,
  },
}: {
  params: {
    top3: StaticParams['top3'];
    bottom3: StaticParams['bottom3'];
    totalAotSubmissions: StaticParams['totalAotSubmissions'];
    correctAotSubmissions: StaticParams['correctAotSubmissions'];
    incorrectAotSubmissions: StaticParams['incorrectAotSubmissions'];
    totalNumberOfAccountsDuringAot: StaticParams['totalNumberOfAccountsDuringAot'];
  };
}) {
  const { enableHolidayEvent } = await getAllFlags();
  if (enableHolidayEvent) {
    const daysPassed = daysAfterDecemberFirst();

    if (daysPassed + 1 < 25) {
      return notFound();
    }
  }

  return (
    <div>
      <Hero />
      <UserSummary
        totalNumberOfAccountsDuringAot={totalNumberOfAccountsDuringAot}
        incorrectAotSubmissions={incorrectAotSubmissions}
        totalAotSubmissions={totalAotSubmissions}
        correctAotSubmissions={correctAotSubmissions}
      />
      <MostSolved mostSolved={top3} />
      <LeastSolved leastSolved={bottom3} />
    </div>
  );
}
