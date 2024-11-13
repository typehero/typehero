'use client';
import { cn } from '@repo/ui/cn';
import { Button } from '@repo/ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export function DayScroller() {
  const segment = useSelectedLayoutSegment();
  const days = Array.from({ length: 25 });
  const [selectedDay, setSelectedDay] = useState(Number(segment));
  console.log(selectedDay);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSelectedDay = useCallback(
    (behavior: 'smooth' | 'instant') => {
      const container = containerRef.current;
      if (container === null) return;
      const children = container.children;
      children[selectedDay]?.scrollIntoView({
        behavior,
        inline: 'center',
        block: 'nearest',
      });
    },
    [selectedDay],
  );

  useLayoutEffect(() => {
    scrollToSelectedDay('instant');
    // The instant scroll on the selected day only needs to happen on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToSelectedDay('smooth');
  }, [containerRef, selectedDay, scrollToSelectedDay]);

  function scroll(direction: -1 | 1) {
    const container = containerRef.current;
    if (container === null) return;
    container.scrollBy({ left: direction * 600, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-row space-x-4">
      <Button variant="ghost" size="icon" className="flex-none" onClick={() => scroll(-1)}>
        <ChevronLeft />
      </Button>
      <div
        ref={containerRef}
        className="scrollbar-hide flex flex-row flex-nowrap space-x-4 overflow-x-scroll "
      >
        <div className="text-nowrap first:pl-[40%] last:pr-[40%]">
          <Button variant="ghost" asChild onClick={() => setSelectedDay(0)}>
            <Link href={'/events/2023/leaderboard'}>
              <h1
                className={cn(
                  'text-foreground text-lg uppercase tracking-wide',
                  selectedDay === 0 ? 'text-foreground' : 'text-foreground/40',
                )}
              >
                Overall
              </h1>
            </Link>
          </Button>
        </div>
        {days.map((_, i) => (
          <div key={i + 1} className="text-nowrap first:pl-[40%] last:pr-[40%]">
            <Button variant="ghost" onClick={() => setSelectedDay(i + 1)} asChild>
              <Link href={`/events/2023/leaderboard/${i + 1}`}>
                <h1
                  className={cn(
                    'text-lg uppercase tracking-wide',
                    selectedDay === i + 1 ? 'text-foreground' : 'text-foreground/40',
                  )}
                >
                  Day {i + 1}
                </h1>
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <Button variant="ghost" size="icon" className="flex-none" onClick={() => scroll(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
