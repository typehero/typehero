import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { Submissions } from './_components';
import { getChallengeSubmissions } from './getChallengeSubmissions';
import { withUnstableCache } from '~/utils/withUnstableCache';

interface Props {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Submissions | TypeHero',
  description: 'View your submissions to this challenge on TypeHero.',
};

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await withUnstableCache({
    fn: getChallengeSubmissions,
    args: [session?.user.id ?? '', id],
    keys: ['all-challenge-submissions'],
    tags: [`${id}-challenge-submissions`],
  });

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}
