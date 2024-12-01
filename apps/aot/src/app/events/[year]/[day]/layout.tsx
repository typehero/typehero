import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { api } from '~/trpc/server';
import { ChallengeLayoutWrapper } from './_components/challenge-layout-wrapper';
import { TrackVisibiltyProvider } from './use-track-visibility.hook';
import { buildMetaForEventPage } from '~/utils/metadata';
import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';

export function generateMetadata() {
  return buildMetaForEventPage();
}

export default async function LayoutData({
  children,
  params: { year, day },
}: {
  children: React.ReactNode;
  params: { year: string; day: string };
}) {
  const { unlockAotChallenges } = await getAllFlags();
  if (!isChallengeUnlocked(Number(year), Number(day)) && !unlockAotChallenges) {
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
