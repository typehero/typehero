import { ChallengeLayoutWrapper } from '~/app/[locale]/challenge/_components/challenge-layout-wrapper';

import { getServerAuthSession } from '@repo/auth/server';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

import { getChallengeRouteData } from './getChallengeRouteData';

export default async function LayoutData({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getServerAuthSession();
  const { challenge, track } = await getChallengeRouteData(slug, session);

  return (
    <ForceRenderUntilClient>
      <ChallengeLayoutWrapper challenge={challenge} track={track}>
        {children}
      </ChallengeLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
