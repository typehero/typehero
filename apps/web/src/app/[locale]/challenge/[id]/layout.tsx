import { getServerAuthSession } from '@repo/auth/server';
import { ChallgengeLayoutWrapper } from '../_components/challenge-layout-wrapper';
import { getChallengeRouteData } from './getChallengeRouteData';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

export default async function LayoutData({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  return (
    <ForceRenderUntilClient>
      <ChallgengeLayoutWrapper
        challengeId={challenge.id}
        challenge={challenge}
        children={children}
      />
    </ForceRenderUntilClient>
  );
}
