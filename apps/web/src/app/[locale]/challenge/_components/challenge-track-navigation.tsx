'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { type ChallengeRouteData } from '~/app/[locale]/challenge/[slug]/getChallengeRouteData';
import { getTrackDetails } from '~/app/[locale]/tracks/_components/track.action';

import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { cn } from '@repo/ui/cn';
import { Swords, ChevronLeft, ChevronRight } from '@repo/ui/icons';

import { ChallengeTrackOutline } from './challenge-track-outline';

interface Props {
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  isCollapsed: boolean;
  className?: string;
}

export function ChallengeTrackNavigation({ challenge, track, isCollapsed, className }: Props) {
  const router = useRouter();

  const { data: trackDetails, isPending } = useQuery({
    queryKey: ['track-details', track?.slug],
    queryFn: () => {
      return getTrackDetails(track!.slug);
    },
    enabled: Boolean(track?.slug),
  });

  const currentIndex = useMemo(() => {
    if (trackDetails === null || trackDetails === undefined) return null;

    const index = trackDetails.trackChallenges.findIndex((x) => x.challengeId === challenge.id);
    return index === -1 ? null : index;
  }, [trackDetails, challenge]);

  const next = useMemo(() => {
    if (currentIndex === null) return null;

    const index = currentIndex + 1;
    return index < trackDetails!.trackChallenges.length
      ? trackDetails!.trackChallenges[index]
      : null;
  }, [currentIndex, trackDetails]);

  const previous = useMemo(() => {
    if (currentIndex === null) return null;

    const index = currentIndex - 1;
    return index > 0 ? trackDetails!.trackChallenges[index] : null;
  }, [currentIndex, trackDetails]);

  if (isPending || track === null || trackDetails === null || trackDetails === undefined)
    return null;

  return (
    <div
      className={cn(
        {
          'flex h-[44px] items-center gap-1': !isCollapsed,
          'text-muted-foreground inline-flex h-auto': isCollapsed,
        },
        className,
      )}
    >
      <ChallengeTrackOutline challenge={challenge} track={trackDetails} asChild>
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
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{track.name}</span>
          )}
        </Button>
      </ChallengeTrackOutline>
      {Boolean(!isCollapsed) && (
        <>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={Boolean(!previous)}
                onClick={() => router.push(`/challenge/${previous!.challenge.slug}`)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={Boolean(!next)}
                onClick={() => router.push(`/challenge/${next!.challenge.slug}`)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}
