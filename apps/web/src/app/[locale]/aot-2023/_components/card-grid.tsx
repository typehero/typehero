import { prisma } from '@repo/db';
import { TiltableCard } from './tiltable-card';
import { auth, type Session } from '@repo/auth/server';

export async function CardGrid() {
  const session = await auth();
  const challenges = await getChallenges(session);
  const challengesToReveal = revealItems(challenges);

  return (
    <div className="container">
      <section className="w-[calc(100% + 8rem)] grid grid-cols-[repeat(1,240px)] justify-center gap-4 sm:px-8 md:-mx-16 md:grid-cols-[repeat(3,240px)] md:px-0 lg:mx-0 lg:w-full xl:grid-cols-[repeat(4,240px)] 2xl:gap-8">
        {challengesToReveal?.map((challenge, i) => {
          return <TiltableCard key={challenge.id} index={i} challenge={challenge} />;
        })}
      </section>
    </div>
  );
}

export type Challenges = NonNullable<Awaited<ReturnType<typeof getChallenges>>>;
async function getChallenges(session: Session | null) {
  const challenges = await prisma.challenge.findMany({
    take: 25,
    include: {
      submission: {
        where: {
          userId: session?.user.id ?? '',
          isSuccessful: true,
        },
        select: {
          isSuccessful: true,
        },
        take: 1,
      },
    },
  });

  return challenges.map((challenge) => ({
    ...challenge,
    hasSolved: challenge.submission.length > 0,
  }));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function revealItems(items: Challenges) {
  const startDate: Date = new Date('2023-11-17');
  const today: Date = new Date();

  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY);

  return items.map((item, index) => {
    const isPastOrCurrentDay = index <= daysPassed;
    return { ...item, isRevealed: isPastOrCurrentDay };
  });
}
