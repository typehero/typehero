'use client';

import { useEffect, useRef, type ReactNode, useState, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFullscreenSettingsStore } from './fullscreen';
import usePanelAdjustments from './usePanelAdjustments';

export const DEFAULT_SETTINGS = {
  width: '500px',
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

const MOBILE_BREAKPOINT = 1025;

export function ChallengeLayout({ left, right }: ChallengeLayoutProps) {
  const parent = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const rightSide = useRef<HTMLDivElement>(null);

  const { settings, updateSettings } = useLayoutSettingsStore();
  const { fssettings, updateFSSettings } = useFullscreenSettingsStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > MOBILE_BREAKPOINT);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const COLLAPSE_BREAKPOINT = isCollapsed ? 50 : 300;
  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;

  const leftStyle = isDesktop
    ? { width: settings.width, minWidth: LEFT_PANEL_BREAKPOINT }
    : { height: settings.height, minHeight: LEFT_PANEL_BREAKPOINT };

  const { leftSide, adjustPanelSize, expandPanel, collapsePanel, isLeftPanelCollapsed } =
    usePanelAdjustments(DEFAULT_DESKTOP_WIDTH_PX, LEFT_PANEL_BREAKPOINT, isDesktop);

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

    const getEventDeltas = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        return {
          dx: e.clientX - x,
          dy: e.clientY - y,
          currPos: isDesktop ? e.clientX : e.clientY,
        };
      }

      const touch = e.changedTouches[0];
      if (!touch) {
        return {
          dx: 0,
          dy: 0,
          currPos: 0,
        };
      }

      return {
        dx: touch.clientX - x,
        dy: touch.clientY - y,
        currPos: isDesktop ? touch.clientX : touch.clientY,
      };
    };

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      const { dx, dy, currPos } = getEventDeltas(e);
      const { width: divideByW, height: divideByH } = parent.current?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };

      const newDimensionValue = isDesktop
        ? ((leftWidth + dx) * 100) / divideByW
        : ((topHeight + dy) * 100) / divideByH;

      if (currPos <= COLLAPSE_BREAKPOINT) {
        collapsePanel();
      } else {
        adjustPanelSize(divideByW, divideByH, newDimensionValue);
      }

      // prevent cursor from blinking when you move mouse too fast (leaving resizer area)
      const cursorStyle = isDesktop ? 'col-resize' : 'row-resize';

      document.body.style.cursor = cursorStyle;

      [rightRef, leftRef].forEach((ref) => {
        ref.style.pointerEvents = 'none';
        ref.style.userSelect = 'none';
      });
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
      setIsCollapsed(isLeftPanelCollapsed());

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
      setIsDesktop(window.innerWidth > MOBILE_BREAKPOINT);

      if (isDesktop) {
        leftRef.style.width = settings.width;
        leftRef.style.height = 'auto';
      } else {
        leftRef.style.height = settings.height;
        leftRef.style.width = 'auto';
      }
    };

    const handleResizerDoubleClick = () => {
      if (!leftSide.current || !rightSide.current) return;

      const currentSize = isDesktop
        ? parseInt(getComputedStyle(leftSide.current).width)
        : parseInt(getComputedStyle(leftSide.current).height);

      if (currentSize < LEFT_PANEL_BREAKPOINT) {
        expandPanel();
        if (isDesktop) {
          leftSide.current.style.width = DEFAULT_DESKTOP_WIDTH_PX;
        } else {
          leftSide.current.style.height = settings.height;
        }
      } else {
        collapsePanel();
        if (isDesktop) {
          leftSide.current.style.width = '0px';
        } else {
          leftSide.current.style.height = '0px';
        }
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
  }, [
    COLLAPSE_BREAKPOINT,
    DEFAULT_DESKTOP_WIDTH_PX,
    LEFT_PANEL_BREAKPOINT,
    adjustPanelSize,
    collapsePanel,
    expandPanel,
    isCollapsed,
    isDesktop,
    isLeftPanelCollapsed,
    leftSide,
    settings,
    updateSettings,
  ]);

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
      <div
        className={
          isDesktop
            ? 'resizer relative cursor-col-resize p-2'
            : 'resizer relative cursor-row-resize p-2'
        }
        ref={resizer}
      >
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-hover:bg-neutral-600 group-active:bg-emerald-400 group-active:duration-75 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </div>
      <div
        className="flex min-h-[90px] w-full flex-1 flex-grow flex-col overflow-hidden rounded-l-xl rounded-r-2xl border border-zinc-300 dark:border-zinc-700 lg:min-w-[500px]"
        ref={rightSide}
      >
        {right}
      </div>
    </div>
  );
}
