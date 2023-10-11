import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { getServerAuthSession } from '@repo/auth/server';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { redirect } from 'next/navigation';
import { useChallengePlaygroundStore } from './challenge-playground-store';
import { ChallengeLayoutWrapper } from '../../challenge/_components/challenge-layout-wrapper';
import type { ChallengeRouteData } from '../../challenge/[id]/getChallengeRouteData';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!isAdminOrModerator(session)) {
    return redirect('/');
  }

  const { values } = useChallengePlaygroundStore();

  const challenge = values.challenge as ChallengeRouteData;

  return (
    <ForceRenderUntilClient>
      <ChallengeLayoutWrapper challenge={challenge}>{children}</ChallengeLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
