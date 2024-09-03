'use client';
import { cn } from '@repo/ui/cn';
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { ChevronLeft, ChevronRight, Swords } from '@repo/ui/icons';
import Link from 'next/link';
import { useMemo } from 'react';
import { useChallengeRouteData } from '~/app/challenge/[slug]/challenge-route-data.hook';
import { ExploreDrawer } from '~/app/challenge/_components/explore-drawer';
import { useProblemExplorerContext } from '~/app/problem-explorer.hooks';

interface ProblemExplorerTrackNav {
  isCollapsed: boolean;
  className?: string;
}
export function ProblemExplorerTrackNav({ isCollapsed, className }: ProblemExplorerTrackNav) {
  const { currentChallenge } = useChallengeRouteData();
  const { getTrack, title } = useProblemExplorerContext();
  const track = getTrack;
  const currentIndex = useMemo(() => {
    if (!track.length) return null;

    const index = track.findIndex((x) => x.id === currentChallenge?.id);
    return index === -1 ? null : index;
  }, [track, currentChallenge]);

  const next = useMemo(() => {
    if (!track.length) return null;
    if (currentIndex === null) return null;

    const nextIndex = currentIndex + 1;
    return nextIndex < track.length ? track[nextIndex] : null;
  }, [currentIndex, track]);

  const previous = useMemo(() => {
    if (!track.length) return null;
    if (currentIndex === null) return null;

    const prevIndex = currentIndex - 1;
    return prevIndex >= 0 ? track[prevIndex] : null;
  }, [currentIndex, track]);

  return (
    <div
      className={cn(
        {
          'flex h-[44px] items-center gap-1': !isCollapsed,
          'inline-flex h-auto text-muted-foreground': isCollapsed,
        },
        className,
      )}
    >
      <ExploreDrawer asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('inline-flex flex-1 gap-2 overflow-hidden rounded-tl-xl', {
            'justify-start': !isCollapsed,
            'h-full items-center justify-center p-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50':
              isCollapsed,
          })}
        >
          <Swords className="h-4 w-4 shrink-0" />
          {Boolean(!isCollapsed) && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {previous?.slug || next?.slug ? title : 'Problem Explorer'}
            </span>
          )}
        </Button>
      </ExploreDrawer>
      {previous?.slug || next?.slug ? (
        <>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {previous?.slug ? (
                <Link
                  href={`/challenge/${previous?.slug}`}
                  className="cursor-pointer rounded-sm border border-muted p-0.5 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-zinc-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-sm border border-muted p-0.5 text-foreground/80 opacity-50 transition-colors dark:hover:bg-zinc-900">
                  <ChevronLeft className="h-5 w-5" />
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>Previous</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {next?.slug ? (
                <Link
                  href={`/challenge/${next?.slug}`}
                  className="cursor-pointer rounded-sm border border-muted p-0.5 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-zinc-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-sm border border-muted p-0.5 text-foreground/80 opacity-50 transition-colors dark:hover:bg-zinc-900">
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent sideOffset={5}>Next</TooltipContent>
          </Tooltip>
        </>
      ) : null}
    </div>
  );
}
