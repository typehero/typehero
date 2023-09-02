'use client';

import { motion, useMotionValue, useTransform, type PanInfo, animate } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import useMeasure from 'react-use-measure';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFullscreenSettingsStore } from './fullscreen';

export const DEFAULT_SETTINGS = {
  width: 500,
  height: 300,
};

type Settings = typeof DEFAULT_SETTINGS;
interface State {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
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

const CONSTANTS = {
  breakpoint: 1024,
  minWidth: 500,
  minHeight: 318,
  collapsX: 250,
  collapsY: 200,
} as const;

export function ChallengeLayout({ left, right }: ChallengeLayoutProps) {
  const loadedRef = useRef(false);
  const { settings, updateSettings } = useLayoutSettingsStore();
  const { fssettings } = useFullscreenSettingsStore();
  const [isDragging, setIsDragging] = useState(false);
  const [ref, containerBounds] = useMeasure();
  const leftPanelWidth = useMotionValue<number>(0);
  const leftPanelHeight = useMotionValue<number>(0);
  const rightPanelWidth = useMotionValue<number>(containerBounds.width);
  const rightPanelHeight = useMotionValue<number>(containerBounds.height);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      updateSettings({
        ...settings,
        width: Math.max(settings.width, CONSTANTS.minWidth),
        height: Math.max(settings.height, CONSTANTS.minHeight),
      });
      return;
    }

    if (containerBounds.width > CONSTANTS.breakpoint) {
      rightPanelWidth.set(containerBounds.width - leftPanelWidth.get());
      rightPanelHeight.set(containerBounds.height);
      leftPanelWidth.set(Math.min(containerBounds.width, settings.width));
      leftPanelHeight.set(containerBounds.height);
    } else {
      leftPanelWidth.set(containerBounds.width);
      leftPanelHeight.set(Math.min(containerBounds.height, settings.height));

      rightPanelWidth.set(containerBounds.width);
      rightPanelHeight.set(containerBounds.height - leftPanelHeight.get());
    }
  }, [
    leftPanelWidth,
    containerBounds,
    rightPanelWidth,
    settings,
    updateSettings,
    leftPanelHeight,
    rightPanelHeight,
  ]);

  const handleRef = useRef<HTMLDivElement>(null);

  function handleHorizontalDrag(info: PanInfo) {
    const handleLeft = handleRef.current?.getBoundingClientRect().left ?? 0;
    const handleRight = handleRef.current?.getBoundingClientRect().right ?? 0;
    const cursPos = info.point;

    if (
      (info.velocity.x > 0 &&
        rightPanelWidth.get() > CONSTANTS.minWidth &&
        cursPos.x > handleLeft) ||
      (info.velocity.x < 0 && leftPanelWidth.get() > CONSTANTS.minWidth && cursPos.x < handleRight)
    ) {
      leftPanelWidth.set(leftPanelWidth.get() + info.delta.x);
    }
    if (
      leftPanelWidth.get() <= CONSTANTS.minWidth &&
      info.velocity.x < 0 &&
      info.point.x < CONSTANTS.collapsX
    ) {
      animate(leftPanelWidth, 0, { duration: 0.1 });
    }
  }

  function handleVerticalDrag(info: PanInfo) {
    const handleTop = handleRef.current?.getBoundingClientRect().top ?? 0;
    const handleBottom = handleRef.current?.getBoundingClientRect().bottom ?? 0;
    const cursPos = info.point;

    if (
      (info.velocity.y > 0 &&
        rightPanelHeight.get() > CONSTANTS.minHeight &&
        cursPos.y > handleTop) ||
      (info.velocity.y < 0 &&
        leftPanelHeight.get() > CONSTANTS.minHeight &&
        cursPos.y < handleBottom)
    ) {
      leftPanelHeight.set(leftPanelHeight.get() + info.delta.y);
    }
    if (
      leftPanelHeight.get() <= CONSTANTS.minHeight &&
      info.velocity.y < 0 &&
      info.point.y < CONSTANTS.collapsY
    ) {
      animate(leftPanelHeight, 0, { duration: 0.1 });
    }
  }

  function handleDrag(info: PanInfo): void {
    containerBounds.width < CONSTANTS.breakpoint
      ? handleVerticalDrag(info)
      : handleHorizontalDrag(info);
  }

  function dragcursor() {
    return containerBounds.width > CONSTANTS.breakpoint ? 'col-resize' : 'row-resize';
  }

  return (
    <div
      className="flex flex-col px-4 pb-4 lg:flex-row"
      style={{ height: fssettings.isFullscreen ? '100vh' : 'calc(100dvh - 3.5rem)' }}
      ref={ref}
    >
      <motion.div
        className="h-[350px] w-full max-w-full overflow-hidden rounded-l-2xl rounded-r-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 lg:h-auto "
        style={{
          width: leftPanelWidth,
          height: leftPanelHeight,
          cursor: isDragging ? dragcursor() : 'default',
        }}
      >
        {left}
      </motion.div>
      <motion.div
        className="resizer relative p-2 hover:cursor-row-resize lg:hover:cursor-col-resize"
        drag
        dragConstraints={handleRef}
        dragElastic={0}
        dragSnapToOrigin
        dragMomentum={false}
        onDrag={(_, info) => handleDrag(info)}
        onDragEnd={() => {
          setIsDragging(false);
          if (containerBounds.width < CONSTANTS.breakpoint) return;
          updateSettings({ ...settings, width: leftPanelWidth.get() });
        }}
        onDragStart={() => {
          setIsDragging(true);
        }}
        ref={handleRef}
      >
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-hover:bg-neutral-600 group-active:bg-emerald-400 group-active:duration-75 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </motion.div>
      <motion.div
        className="flex min-h-[150px] w-full max-w-full flex-1 flex-col overflow-hidden rounded-l-xl rounded-r-2xl border border-zinc-300 dark:border-zinc-700 lg:min-w-[500px]"
        style={{
          width: rightPanelWidth,
          height: rightPanelHeight,
          cursor: isDragging ? dragcursor() : 'default',
        }}
      >
        {right}
      </motion.div>
    </div>
  );
}
