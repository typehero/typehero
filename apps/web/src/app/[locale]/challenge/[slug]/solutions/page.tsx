import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { buildMetaForDefault } from '~/app/metadata';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';
import { getSolutionsRouteData } from './getSolutionRouteData';
import { createCacheKeyForSolutions } from './_components/_actions';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  const challenge = await getChallengeRouteData(slug, null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default async function SolutionPage({ params: { slug } }: Props) {
  const session = await getServerAuthSession();
  const solutions = await withUnstableCache({
    fn: getSolutionsRouteData,
    args: [slug, session],
    keys: ['challenge-solutions'],
    tags: [createCacheKeyForSolutions(slug)],
  });

  if (!solutions) {
    return notFound();
  }

  return <Solutions challenge={solutions} />;
}
