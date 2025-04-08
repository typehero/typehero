import { useEffect, useRef, type ReactNode, useState, type MutableRefObject, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFullscreenSettingsStore } from '../../../components/fullscreen-button';
import { getEventDeltas } from '@repo/monaco/utils';

export const DEFAULT_SETTINGS = {
  width: '500px',
  height: '300px',
};

type Settings = typeof DEFAULT_SETTINGS;
interface ChallengeLayoutState {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useLayoutSettingsStore = create<ChallengeLayoutState>()(
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
  setIsDesktop: (bool: boolean) => void;
  isDesktop: boolean;
  leftSide: MutableRefObject<HTMLDivElement | null>;
  collapsePanel: () => void;
  expandPanel: () => void;
  adjustPanelSize: (divideByW: number, divideByH: number, newDimensionValue: number) => void;
  isLeftPanelCollapsed: () => boolean;
  isPlayground?: boolean;
  isReversed?: boolean;
}

export const MOBILE_BREAKPOINT = 1025;
export const COLLAPSED_DESKTOP_WIDTH = 60;
export const COLLAPSED_MOBILE_HEIGHT = 41;

export function ChallengeLayout({
  left,
  right,
  setIsDesktop,
  isDesktop,
  leftSide,
  adjustPanelSize,
  collapsePanel,
  expandPanel,
  isLeftPanelCollapsed,
  isPlayground,
  isReversed = false,
}: ChallengeLayoutProps) {
  const parent = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const rightSide = useRef<HTMLDivElement>(null);

  const { settings, updateSettings } = useLayoutSettingsStore();
  const { fssettings } = useFullscreenSettingsStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const COLLAPSE_BREAKPOINT = isCollapsed ? 50 : 300;
  const _COLLAPSED_MOBILE_HEIGHT = isPlayground ? 0 : COLLAPSED_MOBILE_HEIGHT;
  const _COLLAPSED_DESKTOP_WIDTH = isPlayground ? 0 : COLLAPSED_DESKTOP_WIDTH;

  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;

  const isPanelCollapsed = useMemo(() => {
    const height = parseFloat(settings.height);
    const width = parseFloat(settings.width);

    return height <= _COLLAPSED_MOBILE_HEIGHT || width <= _COLLAPSED_DESKTOP_WIDTH;
  }, [settings.height, settings.width, _COLLAPSED_MOBILE_HEIGHT, _COLLAPSED_DESKTOP_WIDTH]);

  const leftStyle = useMemo(() => {
    const leftStyleIfDesktopCollapsed = {
      width: `${_COLLAPSED_DESKTOP_WIDTH}px`,
      minWidth: `${_COLLAPSED_DESKTOP_WIDTH}px`,
    };
    const leftStyleIfMobileCollapsed = {
      height: `${_COLLAPSED_MOBILE_HEIGHT}px`,
      minHeight: `${_COLLAPSED_MOBILE_HEIGHT}px`,
    };

    if (isDesktop) {
      return isPanelCollapsed
        ? leftStyleIfDesktopCollapsed
        : {
            width: settings.width,
            minWidth: `${LEFT_PANEL_BREAKPOINT}px`,
          };
    }
    return isPanelCollapsed
      ? leftStyleIfMobileCollapsed
      : {
          height: settings.height,
          minHeight: `${LEFT_PANEL_BREAKPOINT}px`,
        };
  }, [
    isDesktop,
    isPanelCollapsed,
    settings.height,
    settings.width,
    LEFT_PANEL_BREAKPOINT,
    _COLLAPSED_MOBILE_HEIGHT,
    _COLLAPSED_DESKTOP_WIDTH,
  ]);

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
      const { dx, dy, currPosX, currPosY } = getEventDeltas(e, { x, y });
      const currPos = isDesktop ? currPosX : currPosY;
      const { width: divideByW, height: divideByH } = parent.current?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };

      // swap the logic for dragging left and right
      const adjustedDx = isReversed ? -dx : dx;
      const newDimensionValue = isDesktop
        ? ((leftWidth + adjustedDx) * 100) / divideByW
        : ((topHeight + dy) * 100) / divideByH;

      // Adjust collapse check for reversed layout
      const shouldCollapse = isReversed
        ? currPos >= parent.current!.getBoundingClientRect().width - COLLAPSE_BREAKPOINT
        : currPos <= COLLAPSE_BREAKPOINT;

      if (shouldCollapse) {
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
        if (isDesktop) {
          x = e.clientX;
        } else {
          y = e.clientY;
        }
      } else if (e instanceof TouchEvent) {
        // Get the current finger position
        if (isDesktop) {
          x = e.touches[0]?.clientX ?? 0;
        } else {
          y = e.touches[0]?.clientY ?? 0;
        }
      }

      // TODO: Either leftSide.current is always defined, or leftWidth can be nullish
      /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
      if (isDesktop) {
        leftWidth = leftSide.current?.getBoundingClientRect().width!;
      } else {
        topHeight = leftSide.current?.getBoundingClientRect().height!;
      }
      /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */

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

      updateSettings(
        isDesktop
          ? { width: `${leftRef.offsetWidth}px`, height: settings.height }
          : { width: settings.width, height: `${leftRef.offsetHeight}px` },
      );
    };

    // handle window resize
    const resizeHandler = () => {
      const isDesktop = window.innerWidth > MOBILE_BREAKPOINT;
      setIsDesktop(isDesktop);

      const leftRef = leftSide.current;
      if (!leftRef) return;

      const height = parseFloat(leftRef.style.height);
      const width = parseFloat(leftRef.style.width);

      if (height <= _COLLAPSED_MOBILE_HEIGHT || width <= _COLLAPSED_DESKTOP_WIDTH) {
        if (isDesktop) {
          leftRef.style.width = `${_COLLAPSED_DESKTOP_WIDTH}px`;
          updateSettings({ width: `${_COLLAPSED_DESKTOP_WIDTH}px`, height: '300px' });
        } else {
          leftRef.style.height = `${_COLLAPSED_MOBILE_HEIGHT}px`;
          updateSettings({ width: '500px', height: `${_COLLAPSED_MOBILE_HEIGHT}px` });
        }
      }
    };

    const handleResizerDoubleClick = () => {
      setIsCollapsed(isLeftPanelCollapsed());

      if (!leftSide.current || !rightSide.current) return;

      const currentSize = isDesktop
        ? parseInt(getComputedStyle(leftSide.current).width)
        : parseInt(getComputedStyle(leftSide.current).height);

      if (currentSize < LEFT_PANEL_BREAKPOINT) {
        expandPanel();
      } else {
        collapsePanel();
      }

      updateSettings(
        isDesktop
          ? { width: `${leftRef.offsetWidth}px`, height: settings.height }
          : { width: settings.width, height: `${leftRef.offsetHeight}px` },
      );
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
    setIsDesktop,
    isLeftPanelCollapsed,
    leftSide,
    settings,
    updateSettings,
    _COLLAPSED_DESKTOP_WIDTH,
    _COLLAPSED_MOBILE_HEIGHT,
    isReversed,
  ]);

  return (
    <div
      className={`flex flex-col px-4 pb-4 ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
      ref={parent}
      style={{ height: fssettings.isFullscreen ? '100vh' : 'calc(100vh - 3.5rem)' }}
    >
      <div
        className={`w-full overflow-hidden rounded-2xl border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 ${
          !isPlayground && 'border'
        }`}
        ref={leftSide}
        style={{ ...leftStyle }}
      >
        {left}
      </div>
      <div
        className={
          isDesktop
            ? 'resizer group relative cursor-col-resize p-2'
            : 'resizer relative cursor-row-resize p-2'
        }
        ref={resizer}
      >
        <div className="group-hover:bg-primary group-active:bg-primary group-hover:dark:bg-primary absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-active:duration-75 lg:h-24 lg:w-1 dark:bg-neutral-700" />
      </div>
      <div
        className="flex min-h-[90px] w-full flex-1 flex-grow flex-col overflow-hidden rounded-2xl border border-zinc-300 lg:min-w-[500px] dark:border-zinc-700"
        ref={rightSide}
      >
        {right}
      </div>
    </div>
  );
}
