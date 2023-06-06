import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import { CodePanel } from './editor';
import { DescriptionPanel } from './DescriptionPanel';

interface Props {
  id: string;
}
export async function Challenge({ id }: Props) {
  const challenge = await prisma.challenge.findFirst({
    where: { id: +id },
  });

  if (!challenge) {
    notFound();
  }

  console.log({ challenge });
  return (
    <div className="flex h-full gap-2 p-4">
      <DescriptionPanel description={challenge.description} />

      <div className="h-full flex-1">
        <CodePanel prompt={challenge.prompt} />
      </div>
    </div>
  );
}
