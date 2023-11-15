import { prisma } from '@repo/db';
import { ChallengeCard } from './challenge-card';

const slugs = [
  'hello-world',
  'pick',
  'awaited',
  'readonly',
  'exclude',
  'parameters',
  'omit',
  'pop',
  'trim-left',
  'get-return-type',
  'permutation',
  'currying-1',
];

export async function CardGrid() {
  const challenges = await getChallenges();
  const challengesToReveal = revealItems(challenges);

  return (
    <div className="container">
      <section className="w-[calc(100% + 8rem)] grid grid-cols-1 gap-4 sm:px-8 md:-mx-16 md:grid-cols-2 md:px-0 lg:mx-0 lg:w-full xl:grid-cols-3 2xl:gap-8">
        {challengesToReveal?.map((challenge, i) => {
          return <ChallengeCard key={i} challenge={challenge} />;
        })}
      </section>
    </div>
  );
}

export type Challenges = NonNullable<Awaited<ReturnType<typeof getChallenges>>>;
async function getChallenges() {
  return prisma.challenge.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function revealItems(items: Challenges) {
  const startDate: Date = new Date('2023-12-14');
  const today: Date = new Date();

  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY) - 1;

  return items.map((item, index) => {
    const isPastOrCurrentDay = index <= daysPassed;
    return { ...item, isRevealed: isPastOrCurrentDay };
  });
}
