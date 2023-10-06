import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { buildMetaForDefault } from '~/app/metadata';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';
import { getSolutionsRouteData } from './getSolutionRouteData';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props) {
  const challenge = await getChallengeRouteData(id, null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default async function SolutionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const solutions = await withUnstableCache({
    fn: getSolutionsRouteData,
    args: [id, session],
    keys: ['challenge-submissions'],
    tags: [`challenge-${id}-submissions`],
  });

  if (!solutions) {
    return notFound();
  }

  return <Solutions challenge={solutions} />;
}
