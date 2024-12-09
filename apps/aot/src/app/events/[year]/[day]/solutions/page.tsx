import { notFound } from 'next/navigation';
import { isAfterJanuaryFirst } from '~/utils/time-utils';
import { getAotSlug } from '~/utils/getAotSlug';
import { buildMetaForEventPage } from '~/utils/metadata';
import { Solutions } from './_components';

interface SolutionPageProps {
  params: {
    year: string;
    day: string;
  };
}

export function generateMetadata() {
  return buildMetaForEventPage();
}

export default function SolutionPage({ params: { year, day } }: SolutionPageProps) {
  const slug = getAotSlug({ year, day });

  if (!isAfterJanuaryFirst(Number(year))) {
    return notFound();
  }

  return <Solutions slug={slug} />;
}
