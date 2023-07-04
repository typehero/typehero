'use client';

import { DescriptionPanel } from './description-panel';
import { CodePanel } from './editor';
import { useRef, useEffect } from 'react';
import type { Challenge } from '.';
import { useLayoutSettingsStore } from './layout-store';

interface Props {
  challenge: NonNullable<Challenge>;
}

export function InnerIndex({ challenge }: Props) {
  // Query the element
  const parent = useRef<HTMLDivElement | null>(null);
  const resizer = useRef<HTMLDivElement | null>(null);
  const leftSide = useRef<HTMLDivElement | null>(null);
  const rightSide = useRef<HTMLDivElement | null>(null);
  const { settings, updateSettings } = useLayoutSettingsStore();

  useEffect(() => {
    const ref = resizer.current as HTMLDivElement;
    const leftRef = leftSide.current as HTMLDivElement;
    const rightRef = rightSide.current as HTMLDivElement;

    leftRef.style.width = settings.width;

    // The current position of mouse
    let x = 0;

    // Width of left side
    let leftWidth = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      // Get the current mouse position
      x = e.clientX;
      leftWidth = leftSide?.current?.getBoundingClientRect().width as number | 0;

      // Attach the listeners to `document`
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      // TODO: for mobile vertical resize
      // const dy = e.clientY - y;

      const divideBy = parent?.current?.getBoundingClientRect().width as number | 1;
      const newLeftWidth = ((leftWidth + dx) * 100) / divideBy;
      updateSettings({ width: `${rightRef.offsetWidth}px` });

      leftRef.style.width = `${newLeftWidth}%`;
      ref.style.cursor = 'col-resize';
      document.body.style.cursor = 'col-resize';
      leftRef.style.userSelect = 'none';
      leftRef.style.pointerEvents = 'none';

      rightRef.style.userSelect = 'none';
      rightRef.style.pointerEvents = 'none';
    };
    const mouseUpHandler = function () {
      ref.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');

      leftRef.style.removeProperty('user-select');
      leftRef.style.removeProperty('pointer-events');

      rightRef.style.removeProperty('user-select');
      rightRef.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      updateSettings({ width: `${leftRef.offsetWidth}px` });
    };
    ref?.addEventListener('mousedown', mouseDownHandler);

    return () => {
      ref?.removeEventListener('mousedown', mouseDownHandler);
    };
  }, []);

  return (
    <div
      ref={parent}
      className="flex flex-col px-4 pb-4 lg:flex-row"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <div
        ref={leftSide}
        className="w-full min-w-[500px] overflow-y-auto rounded-xl bg-white dark:bg-zinc-800"
      >
        <DescriptionPanel challenge={challenge} />
      </div>
      <div ref={resizer} className="resizer group relative cursor-col-resize p-2">
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400   duration-300 active:duration-75 group-hover:bg-neutral-600 group-active:bg-emerald-400 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </div>
      <div
        ref={rightSide}
        style={{ flex: '1 1 0%' }}
        className="flex w-full min-w-[500px] flex-col overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700"
      >
        <CodePanel challenge={challenge} />
      </div>
    </div>
  );
}
