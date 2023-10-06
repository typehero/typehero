import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { ChallengeLayout } from '../../challenge/_components/challenge-layout';
import { LeftWrapper } from './left-wrapper';
import { Wrapper } from './wrapper';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  return (
    <ForceRenderUntilClient>
      <ChallengeLayout left={<LeftWrapper>{children}</LeftWrapper>} right={<Wrapper />} />
    </ForceRenderUntilClient>
  );
}
