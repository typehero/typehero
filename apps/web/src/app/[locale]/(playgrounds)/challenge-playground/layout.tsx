import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { ChallengeLayout } from '../../challenge/_components/challenge-layout';
import { LeftWrapper } from './left-wrapper';
import { Wrapper } from './wrapper';
import { getServerAuthSession } from '@repo/auth/server';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { redirect } from 'next/navigation';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!isAdminOrModerator(session)) {
    return redirect('/');
  }
  return (
    <ForceRenderUntilClient>
      <ChallengeLayout left={<LeftWrapper>{children}</LeftWrapper>} right={<Wrapper />} />
    </ForceRenderUntilClient>
  );
}
