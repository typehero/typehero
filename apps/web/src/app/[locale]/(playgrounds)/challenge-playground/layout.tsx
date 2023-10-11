import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { getServerAuthSession } from '@repo/auth/server';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { redirect } from 'next/navigation';
import { ChallengePlaygroundLayoutWrapper } from './challenge-playground-layout-wrapper';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!isAdminOrModerator(session)) {
    return redirect('/');
  }

  return (
    <ForceRenderUntilClient>
      <ChallengePlaygroundLayoutWrapper>{children}</ChallengePlaygroundLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
