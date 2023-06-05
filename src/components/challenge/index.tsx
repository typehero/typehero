import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import { CodePanel } from '../ui/editor';

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

  return (
    <>
      <h1>some challenge</h1>

      <h2 className="text-xl">{challenge.name}</h2>
      <CodePanel prompt={challenge.prompt} />
    </>
  );
}
