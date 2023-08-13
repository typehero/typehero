import type { Difficulty, Tags } from '@prisma/client';
import { prisma } from '@repo/db';
import Link from 'next/link';
import { TypographyH3 } from '../ui/typography/h3';
import ExploreCard from './explore-card';

export const dynamic = 'force-dynamic';

interface ExploreSlugProps {
  slug: string;
}

/**
 * todo: paginate the challenges. also make em look nice.
 */
export const ExploreSlug = async ({ slug }: ExploreSlugProps) => {
  let challenges: Awaited<ReturnType<typeof getChallangesByTagOrDifficulty>>;

  try {
    challenges = await getChallangesByTagOrDifficulty(slug);
  } catch (e) {
    console.log(e);
    return (
      <div className="container flex h-full flex-col items-center justify-center gap-8 py-5 md:gap-20 md:pb-20">
        <div className="flex space-y-2">
          <TypographyH3>Oops! We couldn&apos;t find the {slug.toString()} challenges</TypographyH3>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center gap-8 py-5 md:gap-20 md:pb-20">
      <div className="flex space-y-2">
        <TypographyH3>{toPascalCase(slug)}</TypographyH3>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {challenges.map((challenge) => (
          <Link
            className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
            href={`/challenge/${challenge.id}`}
            key={challenge.id}
          >
            <ExploreCard key={`challenge-${challenge.id}`} challenge={challenge} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreSlug;

/**
 * Fetches challenges either by tag or difficulty.
 */
export async function getChallangesByTagOrDifficulty(str: string) {
  const formattedStr = str.trim().toUpperCase();
  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
      user: {
        NOT: {
          status: 'BANNED',
        },
      },
      // OR didn't work. so this workaround is fine because IT WORKS :3
      ...(isTag(formattedStr)
        ? {
            tags: { every: { tag: formattedStr as Tags } },
          }
        : {
            difficulty: { in: [formattedStr as Difficulty] },
          }),
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
      user: true,
    },
  });
}

/**
 * Is the given string a tag?
 */
function isTag(str: string): str is Tags {
  return str === 'POPULAR' || str === 'NEWEST';
}

/**
 * Converts the string to PascalCase.
 */
function toPascalCase(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
}
