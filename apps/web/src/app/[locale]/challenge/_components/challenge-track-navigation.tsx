'use client';

import { useSearchParams } from 'next/navigation';

import { getTrackDetails } from '../../tracks/_components/track.action';

import { type ChallengeRouteData } from '~/app/[locale]/challenge/[id]/getChallengeRouteData';

import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

import { ChallengeTrackOutline } from './challenge-track-outline';
import { Button } from '@repo/ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';

interface Props {
  challenge: ChallengeRouteData;
}

export function ChallengeTrackNavigation({ challenge }: Props) {
  // TODO: validate the challenge we are looking at is actually on this track id
  const search = useSearchParams();
  const trackParam = search.get('trackId');
  const trackId = Number(trackParam);

  const { data: track, isLoading } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => {
      console.log('fetching track');
      return getTrackDetails(trackId);
    },
    enabled: Boolean(trackId),
  });

  // TODO: combine
  if (isLoading) return null;
  if (track === undefined) return null; // there was no `?trackId` in the URL so the query didnt go off
  if (track === null) return null; // we had a `?trackId` but it was invalid

  return (
    <div className="bg-primary text-primary-foreground flex gap-4 px-4 py-1">
      <ChallengeTrackOutline challenge={challenge} track={track} asChild>
        <Button
          className="text-primary-foreground hover:text-secondary-foreground"
          variant="ghost"
          size="xs"
        >
          {track.title}
        </Button>
      </ChallengeTrackOutline>
      {/* TODO: actually make this button work */}
      {/* TODO: disable if there is no previous */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-primary-foreground hover:text-secondary-foreground"
              variant="ghost"
              size="xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous</TooltipContent>
        </Tooltip>
        {/* TODO: actually make this button work */}
        {/* TODO: disable if there is no next */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-primary-foreground hover:text-secondary-foreground"
              variant="ghost"
              size="xs"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
