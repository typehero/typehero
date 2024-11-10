import { notFound } from 'next/navigation';
import { isAfterJanuaryFirst } from '~/utils/time-utils';
import { getAotSlug } from '~/utils/getAotSlug';
import { buildMetaForEventPage } from '~/utils/metadata';
import { Solutions } from './_components';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}

export default async function SolutionPage({ params: { year, day } }: Props) {
  const slug = getAotSlug({ year, day });

  if (!isAfterJanuaryFirst(Number(year))) {
    return notFound();
  }

  return <Solutions slug={slug} />;
}
