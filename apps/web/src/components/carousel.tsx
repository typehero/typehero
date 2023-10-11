'use client';

import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import clsx from 'clsx';
import { useEffect, useRef, useState, type ReactNode, useCallback, useId } from 'react';
import { useResizeObserver } from '~/utils/useResizeObserver';

interface Props {
  children: ReactNode;
}

export function Carousel({ children }: Props) {
  const id = useId();
  const buttonRightSelector = `slideRight-${id}`;
  const buttonLeftSelector = `slideLeft-${id}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const containerElement = containerRef.current;

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const handleScroll = useCallback(() => {
    if (containerElement) {
      const scrollLeft = containerElement.scrollLeft;
      const scrollWidth = containerElement.scrollWidth;
      const clientWidth = containerElement.clientWidth;

      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  }, [containerElement]);

  // observe and handle resizing
  useResizeObserver(containerRef, handleScroll);

  useEffect(() => {
    const handleSlideRight = () => {
      if (containerElement) {
        containerElement.scrollLeft += 330;
      }
    };

    const handleSlideLeft = () => {
      if (containerElement) {
        containerElement.scrollLeft -= 330;
      }
    };

    const buttonRight = containerElement?.querySelector(`[id="${buttonRightSelector}"]`);
    const buttonLeft = containerElement?.querySelector(`[id="${buttonLeftSelector}"]`);

    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
    }

    if (buttonRight) {
      buttonRight.addEventListener('click', handleSlideRight);
    }

    if (buttonLeft) {
      buttonLeft.addEventListener('click', handleSlideLeft);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
      if (buttonRight) {
        buttonRight.removeEventListener('click', handleSlideRight);
      }
      if (buttonLeft) {
        buttonLeft.removeEventListener('click', handleSlideLeft);
      }
    };
  }, [handleScroll, containerElement, buttonRightSelector, buttonLeftSelector]);

  return (
    <div
      className="hide-scrollbar flex w-full snap-x flex-nowrap gap-4 overflow-x-scroll scroll-smooth p-6 px-4 md:px-20"
      id="container"
      ref={containerRef}
    >
      {children}
      <button
        className={clsx(
          'absolute left-40 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 focus:outline-none focus-visible:ring-2 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50',
          showLeftButton && 'sm:block',
        )}
        id={`slideLeft-${id}`}
        aria-hidden={!showLeftButton}
        aria-label="Slide carousel of challenges to the left"
      >
        <ChevronLeft className="h-4 w-4 stroke-[3]" />
      </button>
      <button
        className={clsx(
          'absolute right-40 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 focus:outline-none focus-visible:ring-2 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50',
          showRightButton && 'sm:block',
        )}
        id={`slideRight-${id}`}
        aria-hidden={!showRightButton}
        aria-label="Slide carousel of challenges to the right"
      >
        <ChevronRight className="h-4 w-4 stroke-[3]" />
      </button>
    </div>
  );
}
