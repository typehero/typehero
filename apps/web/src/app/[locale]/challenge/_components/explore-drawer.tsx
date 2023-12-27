import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/sheet';
import { SheetContentCustom } from './sheet-content-custom';
import type { AllChallenges } from '~/components/Navigation/explore-nav';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  asChild?: boolean;
  allChallenges: AllChallenges;
}

export function ExploreDrawer({ children, asChild = false, allChallenges }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 overflow-y-scroll sm:max-w-[400px] md:max-w-[540px]"
        side="left"
      >
        <SheetContentCustom allChallenges={allChallenges} />
      </SheetContent>
    </Sheet>
  );
}
