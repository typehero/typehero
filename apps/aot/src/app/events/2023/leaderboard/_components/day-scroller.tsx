'use client';
import { cn } from '@repo/ui/cn';
import { Button } from '@repo/ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import { useEffect, useRef, useState } from 'react';

export function DayScroller() {
  const days = Array.from({ length: 25 });
  const currentDay = 20;
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;
    const children = container.children;
    children[selectedDay]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [containerRef, selectedDay]);

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
        {days.map((_, i) => (
          <div
            key={i}
            className="text-nowrap first:pl-[40%] last:pr-[40%]"
            onClick={() => setSelectedDay(i)}
          >
            <Button variant="ghost">
              <h1
                className={cn(
                  'text-lg uppercase tracking-wide',
                  selectedDay === i ? 'text-foreground' : 'text-foreground/40',
                )}
              >
                Day {i + 1}
              </h1>
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
