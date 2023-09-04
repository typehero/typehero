import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';
import { getChallengeSubmissions } from './getChallengeSubmissions';
import { Submissions } from './_components';
import type { Metadata } from 'next';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const submissions = await getChallengeSubmissions('', id);

  if (!submissions) {
    return {
      title: 'Submissions | TypeHero',
      description: 'View your submissions to this challenge on TypeHero.',
    };
  }

  return {
    title: `${submissions.length} Submission${submissions.length == 1 ? '' : 's'} | TypeHero`,
    description: 'View all of your submissions to this challenge on TypeHero.',
  };
}

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await getChallengeSubmissions(session?.user.id ?? '', id);

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}
