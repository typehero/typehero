import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import { DescriptionPanel } from './description-panel';
import { CodePanel } from './editor';
import { getServerSession } from 'next-auth';

interface Props {
  id: string;
}
export async function Challenge({ id }: Props) {
  const session = await getServerSession();
  const challenge = await prisma.challenge.findFirst({
    where: { id: +id },
    include: {
      _count: {
        select: { Vote: true },
      },
      Vote: {
        where: {
          userId: session?.user.id,
          challengeId: +id,
        },
      },
      Bookmark: {
        where: {
          userId: session?.user.id,
          challengeId: +id,
        },
      },
    },
  });

  if (!challenge || typeof challenge.prompt !== 'string') {
    notFound();
  }

  return (
    <div
      className="flex flex-col gap-2 px-4 pb-4 lg:flex-row 2xl:grid 2xl:grid-cols-3"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <DescriptionPanel challenge={challenge} />

      <CodePanel prompt={challenge.prompt} />
    </div>
  );
}
