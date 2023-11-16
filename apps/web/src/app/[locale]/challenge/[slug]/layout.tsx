import { ChallengeLayoutWrapper } from '~/app/[locale]/challenge/_components/challenge-layout-wrapper';

import { auth } from '@repo/auth/server';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { getChallengeRouteData } from './getChallengeRouteData';
import { TrackVisibiltyProvider } from './use-track-visibility.hook';

export default async function LayoutData({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await auth();
  const { challenge, track } = await getChallengeRouteData(slug, session);

  return (
    <ForceRenderUntilClient>
      <TrackVisibiltyProvider>
        <ChallengeLayoutWrapper challenge={challenge} track={track}>
          {children}
        </ChallengeLayoutWrapper>
      </TrackVisibiltyProvider>
    </ForceRenderUntilClient>
  );
}
