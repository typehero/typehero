import { prisma } from '@repo/db';
import { Hero } from './_components/hero';
import { LeastSolved } from './_components/least-solved';
import { MostSolved } from './_components/most-solved';
import { UserSummary } from './_components/user-summary';
import { AOT_CHALLENGES } from '../../challenge/[slug]/aot-slugs';
import { getStaticParams } from '~/locales/server';
import { setStaticParamsLocale } from 'next-international/server';

export function generateStaticParams() {
  return getStaticParams();
}
export default async function Index({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);
  const mostSolved = await prisma.submission.groupBy({
    by: ['challengeId'],
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: true,
    },
    _count: {
      challengeId: true,
    },
    orderBy: {
      _count: {
        challengeId: 'desc',
      },
    },
    take: 3,
  });
  const leastSolved = await prisma.submission.groupBy({
    by: ['challengeId'],
    where: {
      challenge: {
        slug: {
          in: AOT_CHALLENGES,
        },
      },
      isSuccessful: true,
    },
    _count: {
      challengeId: true,
    },
    orderBy: {
      _count: {
        challengeId: 'asc',
      },
    },
    take: 3,
  });

  const mostSolvedChallengeMetadata = await prisma.challenge.findMany({
    where: {
      id: {
        in: mostSolved.map((s) => s.challengeId),
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  const mostSolvedWithSlug = mostSolved.map((s) => {
    const metadata = mostSolvedChallengeMetadata.find((slug) => slug.id === s.challengeId);
    return {
      ...s,
      ...metadata,
    };
  });

  const leastSolvedChallengeMetadata = await prisma.challenge.findMany({
    where: {
      id: {
        in: leastSolved.map((s) => s.challengeId),
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  const leastSolvedWithSlug = leastSolved.map((s) => {
    const metadata = leastSolvedChallengeMetadata.find((slug) => slug.id === s.challengeId);
    return {
      ...s,
      ...metadata,
    };
  });

  return (
    <div>
      <Hero />
      <UserSummary />
      <MostSolved mostSolved={mostSolvedWithSlug} />
      <LeastSolved leastSolved={leastSolvedWithSlug} />
    </div>
  );
}
