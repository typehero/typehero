import { buildMetaForDefault } from '~/app/metadata';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: SolutionPageProps) {
  const params = await props.params;

  const { slug } = params;

  const { challenge } = await getChallengeRouteData(slug, null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default async function SolutionPage(props: SolutionPageProps) {
  const params = await props.params;

  const { slug } = params;

  return <Solutions slug={slug} />;
}
