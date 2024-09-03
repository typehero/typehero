'use client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';
import { useMemo } from 'react';
import { useChallengeRouteData } from '~/app/challenge/[slug]/challenge-route-data.hook';
import { ExploreDrawer } from '~/app/challenge/_components/explore-drawer';
import { useProblemExplorerContext } from '~/app/problem-explorer.hooks';

export function ProblemExplorerNav() {
  const { currentChallenge } = useChallengeRouteData();
  const { getTrack } = useProblemExplorerContext();
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

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center gap-1.5">
      <ExploreDrawer asChild>
        <span className="mr-1 cursor-pointer items-center text-foreground/80 transition-colors hover:text-foreground">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <span>Explorer</span>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>Expand panel</TooltipContent>
          </Tooltip>
        </span>
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
