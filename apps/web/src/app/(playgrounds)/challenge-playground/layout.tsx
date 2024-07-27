import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { redirect } from 'next/navigation';
import { ChallengePlaygroundLayoutWrapper } from './challenge-playground-layout-wrapper';
import { auth } from '@repo/auth/server';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!isAdminOrModerator(session)) {
    return redirect('/');
  }

  return (
    <ForceRenderUntilClient>
      <ChallengePlaygroundLayoutWrapper>{children}</ChallengePlaygroundLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
