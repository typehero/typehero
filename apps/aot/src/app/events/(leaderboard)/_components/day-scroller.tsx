'use client';
import { cn } from '@repo/ui/cn';
import { Button } from '@repo/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export function DayScroller(props: { eventDay?: number; year: number }) {
  console.log(props.eventDay);
  const segment = useSelectedLayoutSegment();
  const days = Array.from({ length: 25 });
  const [selectedDay, setSelectedDay] = useState(Number(segment));
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSelectedDay = useCallback(
    (behavior: 'instant' | 'smooth') => {
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
        <div className="text-nowrap md:first:pl-[45%]">
          <Button variant="ghost" asChild onClick={() => setSelectedDay(0)}>
            <Link href={`/events/${props.year}/leaderboard`} prefetch>
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
        <TooltipProvider>
          {days.map((_, i) => (
            <div key={i + 1} className="text-nowrap last:pr-[40%]">
              <DayLink
                year={props.year}
                setSelectedDay={setSelectedDay}
                eventDay={props.eventDay ?? 25}
                selectedDay={selectedDay}
                i={i}
              />
            </div>
          ))}
        </TooltipProvider>
      </div>

      <Button variant="ghost" size="icon" className="flex-none" onClick={() => scroll(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}

function DayLink({
  selectedDay,
  i,
  eventDay,
  setSelectedDay,
  year,
}: {
  selectedDay: number;
  i: number;
  eventDay: number;
  setSelectedDay: (val: number) => void;
  year: number;
}) {
  if (i + 1 <= eventDay) {
    return (
      <Button variant="ghost" onClick={() => setSelectedDay(i + 1)} asChild>
        <Link href={`/events/${year}/leaderboard/${i + 1}`} prefetch>
          <h1
            className={cn(
              'text-lg uppercase tracking-wide',
              selectedDay === i + 1 ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            Day {i + 1}
          </h1>
        </Link>
      </Button>
    );
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="cursor-not-allowed">
          <h1 className={cn('text-foreground/30 text-lg uppercase tracking-wide')}>Day {i + 1}</h1>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start">
        <p className="text-xs">Unlocks on December {i + 1}</p>
      </TooltipContent>
    </Tooltip>
  );
}
