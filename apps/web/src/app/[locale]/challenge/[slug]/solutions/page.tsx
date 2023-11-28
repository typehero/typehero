import { buildMetaForDefault } from '~/app/metadata';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';
import { AOT_CHALLENGES } from '../aot-slugs';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  const { challenge } = await getChallengeRouteData(slug, null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default async function SolutionPage({ params: { slug } }: Props) {
  if (AOT_CHALLENGES.includes(slug)) return notFound();
  return <Solutions slug={slug} />;
}
