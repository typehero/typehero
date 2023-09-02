'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFullscreenSettingsStore } from './fullscreen';

const MOBILE_BREAKPOINT = 1025;
const LEFT_PANEL_BREAKPOINT = 500;
const COLLAPSE_BREAKPOINT = 300;
const DEFAULT_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;

export const DEFAULT_SETTINGS = {
  width: DEFAULT_WIDTH_PX,
  height: '300px',
};

type Settings = typeof DEFAULT_SETTINGS;
interface State {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useLayoutSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),
    }),
    {
      name: 'challenge-layout-settings',
    },
  ),
);

export interface ChallengeLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;

const collapseLeftPanel = (element: HTMLDivElement) => {
  element.style.width = '0%';
  element.style.minWidth = '0%';
  element.style.opacity = '0%';
};

const expandLeftPanel = (element: HTMLDivElement) => {
  element.style.width = DEFAULT_WIDTH_PX;
  element.style.minWidth = DEFAULT_WIDTH_PX;
  element.style.opacity = '100%';
};

export function ChallengeLayout({ left, right }: ChallengeLayoutProps) {
  const parent = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const leftSide = useRef<HTMLDivElement>(null);
  const rightSide = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useLayoutSettingsStore();
  const { fssettings, updateFSSettings } = useFullscreenSettingsStore();
  const leftStyle = isDesktop
    ? { width: settings.width, minWidth: LEFT_PANEL_BREAKPOINT }
    : { height: settings.height };

  useEffect(() => {
    const ref = resizer.current;
    const leftRef = leftSide.current;
    const rightRef = rightSide.current;

    if (!leftRef || !rightRef || !ref) return;

    // initialize
    if (isDesktop) {
      leftRef.style.width = settings.width;
    } else {
      leftRef.style.height = settings.height;
    }

    // The current position of mouse
    let x = 0;
    let y = 0;
    // Width of left side on dekstop, height of top side on mobile;
    let leftWidth = 0;
    let topHeight = 0;

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      let dx = 0;
      let dy = 0;
      let currX = 0;

      if (e instanceof MouseEvent) {
        // How far the mouse has been moved
        dx = e.clientX - x;
        dy = e.clientY - y;
        currX = e.clientX;
      } else if (e instanceof TouchEvent) {
        // How far the finger has been moved
        dx = e.changedTouches[0]?.clientX ? e.changedTouches[0].clientX - x : 0;
        dy = e.changedTouches[0]?.clientY ? e.changedTouches[0].clientY - y : 0;
        currX = e.changedTouches[0]?.clientX ? e.changedTouches[0]?.clientX : 0;
      }

      const divideByW = parent.current?.getBoundingClientRect().width!;
      const divideByH = parent.current?.getBoundingClientRect().height!;
      const newLeftWidth = ((leftWidth + dx) * 100) / divideByW;
      const newTopHeight = ((topHeight + dy) * 100) / divideByH;

      if (isDesktop) {
        if (currX <= COLLAPSE_BREAKPOINT) {
          collapseLeftPanel(leftRef);
        } else if (leftRef.style.width === '0%') {
          expandLeftPanel(leftRef);
        } else {
          const pixelWidth = (newLeftWidth / 100) * divideByW;
          if (pixelWidth < LEFT_PANEL_BREAKPOINT) {
            leftRef.style.width = `${(LEFT_PANEL_BREAKPOINT / divideByW) * 100}%`;
          } else {
            leftRef.style.width = `${newLeftWidth}%`;
          }
        }
      } else {
        leftRef.style.height = `${newTopHeight}%`;
      }

      // prevent cursor from blinking when you move mouse too fast (leaving resizer area)
      document.body.style.cursor = isDesktop ? 'col-resize' : 'row-resize';

      rightRef.style.pointerEvents = 'none';
      leftRef.style.pointerEvents = 'none';
      rightRef.style.userSelect = 'none';
      leftRef.style.userSelect = 'none';
    };

    const mouseDownHandler = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        // Get the current mouse position
        isDesktop ? (x = e.clientX) : (y = e.clientY);
      } else if (e instanceof TouchEvent) {
        // Get the current finger position
        isDesktop ? (x = e.touches[0]?.clientX ?? 0) : (y = e.touches[0]?.clientY ?? 0);
      }

      isDesktop
        ? (leftWidth = leftSide.current?.getBoundingClientRect().width!)
        : (topHeight = leftSide.current?.getBoundingClientRect().height!);

      // Attach the listeners to `document`
      if (e instanceof MouseEvent) {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      } else if (e instanceof TouchEvent) {
        document.addEventListener('touchmove', mouseMoveHandler);
        document.addEventListener('touchend', mouseUpHandler, false);
      }
    };

    const mouseUpHandler = function () {
      // undo cursor col-resize from above
      document.body.style.removeProperty('cursor');

      // undo text selection prevention
      leftRef.style.removeProperty('user-select');
      rightRef.style.removeProperty('user-select');
      leftRef.style.removeProperty('pointer-events');
      rightRef.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup` or `touchmove` and `touchend` from the `document`
      document.removeEventListener('touchmove', mouseMoveHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchend', mouseUpHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      isDesktop
        ? updateSettings({ width: `${leftRef.offsetWidth}px`, height: settings.height })
        : updateSettings({ width: settings.width, height: `${leftRef.offsetHeight}px` });
    };

    // handle window resize
    const resizeHandler = () => {
      if (isDesktop) {
        leftRef.style.width = settings.width;
        leftRef.style.height = 'auto';
      } else {
        leftRef.style.height = settings.height;
        leftRef.style.width = 'auto';
      }
    };

    const handleResizerDoubleClick = () => {
      if (!leftSide.current) return;

      if (parseInt(leftSide.current.style.width) < LEFT_PANEL_BREAKPOINT) {
        expandLeftPanel(leftSide.current);
        updateSettings({ width: DEFAULT_WIDTH_PX, height: settings.height });
      } else {
        collapseLeftPanel(leftSide.current);
        updateSettings({ width: '0px', height: settings.height });
      }
    };

    window.addEventListener('resize', resizeHandler);
    ref.addEventListener('mousedown', mouseDownHandler);
    ref.addEventListener('touchstart', mouseDownHandler, false);
    ref.addEventListener('dblclick', handleResizerDoubleClick);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      ref.removeEventListener('mousedown', mouseDownHandler);
      ref.removeEventListener('touchstart', mouseDownHandler);
      ref.removeEventListener('dblclick', handleResizerDoubleClick);
    };
  }, [settings, updateSettings]);

  return (
    <div
      className="flex flex-col px-4 pb-4 lg:flex-row"
      ref={parent}
      style={{ height: fssettings.isFullscreen ? '100vh' : 'calc(100vh - 3.5rem)' }}
    >
      <div
        className="min-h-[318px] w-full overflow-hidden rounded-l-2xl rounded-r-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        ref={leftSide}
        style={{ ...leftStyle }}
      >
        {left}
      </div>
      <div className="resizer relative cursor-col-resize p-2" ref={resizer}>
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-hover:bg-neutral-600 group-active:bg-emerald-400 group-active:duration-75 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </div>
      <div
        className="flex min-h-[90px] w-full flex-1 flex-col overflow-hidden rounded-l-xl rounded-r-2xl border border-zinc-300 dark:border-zinc-700 lg:min-w-[500px]"
        ref={rightSide}
      >
        {right}
      </div>
    </div>
  );
}
