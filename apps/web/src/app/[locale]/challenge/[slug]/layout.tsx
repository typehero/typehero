import { getServerAuthSession } from '@repo/auth/server';
import { ChallengeLayoutWrapper } from '../_components/challenge-layout-wrapper';
import { getChallengeRouteData } from './getChallengeRouteData';
import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';

export default async function LayoutData({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(slug, session);

  return (
    <ForceRenderUntilClient>
      <ChallengeLayoutWrapper challenge={challenge}>{children}</ChallengeLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
