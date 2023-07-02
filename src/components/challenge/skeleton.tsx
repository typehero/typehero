import { DescriptionPanelSkeleton } from './description-panel-skeleton';

export function ChallengeSkeleton() {
  return (
    <div className="flex h-full gap-2 p-4">
      <DescriptionPanelSkeleton />
      <div className="flex h-full flex-1 flex-col"></div>
    </div>
  );
}
