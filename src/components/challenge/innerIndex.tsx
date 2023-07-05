'use client';

import { CodePanel } from './editor';
import { DescriptionPanel } from './description-panel';
import { useRef, useEffect } from 'react';
import { useLayoutSettingsStore } from './layout-store';

import type { Challenge } from '.';
interface Props {
  challenge: NonNullable<Challenge>;
}

export function InnerIndex({ challenge }: Props) {
  const parent = useRef<HTMLDivElement | null>(null);
  const resizer = useRef<HTMLDivElement | null>(null);
  const leftSide = useRef<HTMLDivElement | null>(null);
  const rightSide = useRef<HTMLDivElement | null>(null);
  const { settings, updateSettings } = useLayoutSettingsStore();

  useEffect(() => {
    const ref = resizer.current as HTMLDivElement;
    const leftRef = leftSide.current as HTMLDivElement;
    const rightRef = rightSide.current as HTMLDivElement;

    // resize width on desktop, height on mobile
    window.innerWidth > 1025
      ? (leftRef.style.width = settings.width)
      : (leftRef.style.height = settings.height);

    // The current position of mouse
    let x = 0;
    let y = 0;

    // Width of left side on dekstop, height of top side on mobile;
    let leftWidth = 0;
    let topHeight = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      // Get the current mouse position
      window.innerWidth > 1025 ? (x = e.clientX) : (y = e.clientY);

      window.innerWidth > 1025
        ? (leftWidth = leftSide?.current?.getBoundingClientRect().width as number | 0)
        : (topHeight = leftSide?.current?.getBoundingClientRect().height as number | 0);

      // Attach the listeners to `document`
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      const divideByW = parent?.current?.getBoundingClientRect().width as number | 1;
      const divideByH = parent?.current?.getBoundingClientRect().height as number | 1;
      const newLeftWidth = ((leftWidth + dx) * 100) / divideByW;
      const newTopHeight = ((topHeight + dy) * 100) / divideByH;

      window.innerWidth > 1025
        ? (leftRef.style.width = `${newLeftWidth}%`)
        : (leftRef.style.height = `${newTopHeight}%`);

      // prevent cursor from blinking when you move mouse too fast (leaving resizer area)
      window.innerWidth > 1025
        ? (document.body.style.cursor = 'col-resize')
        : (document.body.style.cursor = 'row-resize');

      // prevent unexpected text selection while resizing
      rightRef.style.pointerEvents = 'none';
      leftRef.style.pointerEvents = 'none';
      rightRef.style.userSelect = 'none';
      leftRef.style.userSelect = 'none';
    };
    const mouseUpHandler = function () {
      // undo cursor col-resize from above
      document.body.style.removeProperty('cursor');

      // undo text selection prevention
      leftRef.style.removeProperty('user-select');
      rightRef.style.removeProperty('user-select');
      leftRef.style.removeProperty('pointer-events');
      rightRef.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      window.innerWidth > 1025
        ? updateSettings({ width: `${leftRef.offsetWidth}px`, height: settings.height })
        : updateSettings({ width: settings.width, height: `${leftRef.offsetHeight}px` });
    };

    // handle window resize
    const resizeHandler = () => {
      window.innerWidth > 1025
        ? ((leftRef.style.width = settings.width), (leftRef.style.height = 'auto'))
        : ((leftRef.style.height = settings.height), (leftRef.style.width = 'auto'));
    };

    window.addEventListener('resize', resizeHandler);

    ref?.addEventListener('mousedown', mouseDownHandler);

    return () => {
      ref?.removeEventListener('mousedown', mouseDownHandler);
    };
  }, [settings, updateSettings]);

  return (
    <div
      ref={parent}
      className="flex flex-col px-4 pb-4 lg:flex-row"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <div
        ref={leftSide}
        className="min-h-[42px] w-full overflow-y-auto rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 lg:min-w-[500px]"
      >
        <DescriptionPanel challenge={challenge} />
      </div>
      <div
        ref={resizer}
        className="resizer group relative cursor-row-resize p-2 lg:cursor-col-resize"
      >
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-hover:bg-neutral-600 group-active:bg-emerald-400 group-active:duration-75 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </div>
      <div
        ref={rightSide}
        style={{ flex: '1 1 0%' }}
        className="flex min-h-[90px] w-full flex-col overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 lg:min-w-[500px]"
      >
        <CodePanel challenge={challenge} />
      </div>
    </div>
  );
}
