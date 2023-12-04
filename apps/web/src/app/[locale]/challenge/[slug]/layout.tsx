import { ChallengeLayoutWrapper } from '~/app/[locale]/challenge/_components/challenge-layout-wrapper';

import { auth } from '@repo/auth/server';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { getChallengeRouteData } from './getChallengeRouteData';
import { TrackVisibiltyProvider } from './use-track-visibility.hook';

export default async function LayoutData({
  right,
  left,
  params: { slug },
}: {
  right: React.ReactNode;
  left: React.ReactNode;
  params: { slug: string };
}) {
  const session = await auth();
  const { challenge, track } = await getChallengeRouteData(slug, session);

  return (
    <ForceRenderUntilClient>
      <TrackVisibiltyProvider>
        <ChallengeLayoutWrapper challenge={challenge} track={track} right={right} left={left} />
      </TrackVisibiltyProvider>
    </ForceRenderUntilClient>
  );
}
