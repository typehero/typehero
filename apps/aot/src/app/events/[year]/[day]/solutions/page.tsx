import { buildMetaForDefault } from '~/utils/metadata';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Solutions } from './_components';
import { getAotSlug } from '~/utils/getAotSlug';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export async function generateMetadata({ params: { year, day } }: Props) {
  const { challenge } = await getChallengeRouteData(getAotSlug({ year, day }), null);
  return buildMetaForDefault({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
  });
}

export default async function SolutionPage({ params: { year, day } }: Props) {
  const slug = getAotSlug({ year, day });
  return <Solutions slug={slug} />;
}
