import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { api } from '~/trpc/server';
import { ChallengeLayoutWrapper } from './_components/challenge-layout-wrapper';
import { TrackVisibiltyProvider } from './use-track-visibility.hook';
import { buildMetaForEventPage } from '~/utils/metadata';
import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    year: string;
    day: string;
  };
}
export async function generateMetadata({ params: { year } }: Props) {
  return buildMetaForEventPage({
    title: `Advent of Typescript ${year}`,
    description: `Advent of Typescript ${year}`,
  });
}

export default async function LayoutData({
  children,
  params: { year, day },
}: {
  children: React.ReactNode;
  params: { year: string; day: string };
}) {
  if (!isChallengeUnlocked(Number(year), Number(day))) {
    return notFound();
  }
  // we do the same query in page.tsx..
  // confirm its reusing the cache or doing two duplicate queries
  const challenge = await api.event.getEventChallengeBySlug({ slug: `${year}-${day}` });

  return (
    <ForceRenderUntilClient>
      <TrackVisibiltyProvider>
        <ChallengeLayoutWrapper challenge={challenge}>{children}</ChallengeLayoutWrapper>
      </TrackVisibiltyProvider>
    </ForceRenderUntilClient>
  );
}
