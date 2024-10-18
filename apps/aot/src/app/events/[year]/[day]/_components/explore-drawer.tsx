import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/sheet';
import { ExplorerPanel } from './sheet-content-custom';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  asChild?: boolean;
}

export function ExploreDrawer({ children, asChild = false }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild={asChild}>{children}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-8 overflow-y-scroll sm:max-w-[400px] md:max-w-[540px]"
        side="left"
      >
        <ExplorerPanel />
      </SheetContent>
    </Sheet>
  );
}
