import { DescriptionPanelSkeleton } from './description-panel-skeleton';

export function ChallengeSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 px-4 pb-4 md:flex-row 2xl:grid 2xl:grid-cols-3"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <DescriptionPanelSkeleton />
      <div className="flex h-full flex-1 flex-col"></div>
    </div>
  );
}
