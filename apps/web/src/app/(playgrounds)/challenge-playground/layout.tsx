import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { redirect } from 'next/navigation';
import { auth } from '~/server/auth';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { ChallengePlaygroundLayoutWrapper } from './challenge-playground-layout-wrapper';

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
