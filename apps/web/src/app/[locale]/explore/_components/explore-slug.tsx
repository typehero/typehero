import { TypographyH3 } from '@repo/ui';
import Link from 'next/link';
import { ExploreCard } from './explore-card';
import { getChallengesByTagOrDifficulty } from './explore.action';

interface ExploreSlugProps {
  slug: string;
}

/**
 * todo: paginate the challenges. also make em look nice.
 */
export async function ExploreSlug({ slug }: ExploreSlugProps) {
  const challenges = await getChallengesByTagOrDifficulty(slug);

  return (
    <div className="container flex flex-col items-center gap-8 py-5 md:gap-16 md:pb-20">
      <div className="flex space-y-2">
        <TypographyH3>{toPascalCase(slug)}</TypographyH3>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6">
        {challenges.map((challenge) => (
          <Link
            className="group block w-[95%] focus:outline-none sm:w-[330px] xl:w-[333px]"
            href={`/challenge/${challenge.id}`}
            key={challenge.id}
          >
            <ExploreCard key={`challenge-${challenge.id}`} challenge={challenge} />
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Converts the string to PascalCase.
 */
export function toPascalCase(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
}
