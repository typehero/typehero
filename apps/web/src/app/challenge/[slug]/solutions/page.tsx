import { buildMetaForDefault } from '~/app/metadata';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';

interface SolutionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: SolutionPageProps) {
  const { challenge } = await getChallengeRouteData(slug, null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default function SolutionPage({ params: { slug } }: SolutionPageProps) {
  return <Solutions slug={slug} />;
}
