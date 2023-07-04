'use client';

import { DescriptionPanelSkeleton } from './description-panel-skeleton';
import { useLayoutSettingsStore } from './layout-store';
import { useRef, useEffect } from 'react';

export function ChallengeSkeleton() {
  const leftSide = useRef<HTMLDivElement | null>(null);
  const wholeThing = useRef<HTMLDivElement | null>(null);
  const { settings } = useLayoutSettingsStore();

  useEffect(() => {
    const wholeRef = wholeThing.current as HTMLDivElement;
    const leftRef = leftSide.current as HTMLDivElement;
    wholeRef.classList.remove('opacity-0');
    window.innerWidth > 1025
      ? (leftRef.style.width = settings.width)
      : (leftRef.style.height = settings.height);
  }, [settings]);
  return (
    <div
      ref={wholeThing}
      className="flex flex-col px-4 pb-4 opacity-0 lg:flex-row"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <div
        ref={leftSide}
        className="w-full min-w-full animate-pulse overflow-y-auto rounded-xl bg-white dark:bg-zinc-800 lg:min-w-[500px]"
      >
        <DescriptionPanelSkeleton />
      </div>
      <div className="resizer relative p-2">
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 dark:bg-neutral-700 lg:h-24 lg:w-1" />
      </div>
      <div
        style={{ flex: '1 1 0%' }}
        className="flex flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-300 pb-3 dark:border-zinc-700 dark:bg-[#1e1e1e] lg:min-w-[500px]"
      >
        Loading...
      </div>
    </div>
  );
}
