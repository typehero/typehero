import { ChallengeLayoutWrapper } from '~/app/challenge/_components/challenge-layout-wrapper';

import { auth } from '~/server/auth';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { getChallengeRouteData } from './getChallengeRouteData';
import { TrackVisibiltyProvider } from './use-track-visibility.hook';
import { ContextProviders } from './context-providers';
import { AOT_CHALLENGES } from './aot-slugs';
import { notFound } from 'next/navigation';

export default async function LayoutData({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  if (AOT_CHALLENGES.includes(slug)) {
    return notFound();
  }
  const session = await auth();
  const { challenge, track } = await getChallengeRouteData(slug, session);

  return (
    <ForceRenderUntilClient>
      <ContextProviders>
        <TrackVisibiltyProvider>
          <ChallengeLayoutWrapper challenge={challenge} track={track}>
            {children}
          </ChallengeLayoutWrapper>
        </TrackVisibiltyProvider>
      </ContextProviders>
    </ForceRenderUntilClient>
  );
}
