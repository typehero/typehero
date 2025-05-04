import { notFound } from 'next/navigation';
import { isAfterJanuaryFirst } from '~/utils/time-utils';
import { getAotSlug } from '~/utils/getAotSlug';
import { buildMetaForEventPage } from '~/utils/metadata';
import { Solutions } from './_components';

interface SolutionPageProps {
  params: Promise<{
    year: string;
    day: string;
  }>;
}

export function generateMetadata() {
  return buildMetaForEventPage();
}

export default async function SolutionPage(props: SolutionPageProps) {
  const params = await props.params;

  const { year, day } = params;

  const slug = getAotSlug({ year, day });

  if (!isAfterJanuaryFirst(Number(year))) {
    return notFound();
  }

  return <Solutions slug={slug} />;
}
