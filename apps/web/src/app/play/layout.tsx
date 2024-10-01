import { ForceRenderUntilClient } from '@repo/ui/components/force-render-until-client';
import { PlaygroundLayoutWrapper } from './_components/playground-layout-wrapper';

export default async function LayoutData({ children }: { children: React.ReactNode }) {
  return (
    <ForceRenderUntilClient>
      <PlaygroundLayoutWrapper>{children}</PlaygroundLayoutWrapper>
    </ForceRenderUntilClient>
  );
}
