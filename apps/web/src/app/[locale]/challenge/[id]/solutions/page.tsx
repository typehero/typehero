import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { Solutions } from './_components';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { buildMetaForChallenge } from '~/app/metadata';
import { getSolutionsRouteData } from './getSolutionRouteData';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props) {
  const challenge = await getChallengeRouteData(id, null);
  return buildMetaForChallenge({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
    username: challenge.user.name,
  });
}

export default async function SolutionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const solutions = await getSolutionsRouteData(id, session);

  if (!solutions) {
    return notFound();
  }

  return <Solutions challenge={solutions} />;
}
