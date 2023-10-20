'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/use-toast';
import type { enrollUserInTrack, unenrollUserFromTrack } from './track.action';

interface EnrollButtonProps {
  action: typeof enrollUserInTrack | typeof unenrollUserFromTrack;
  text: string;
  trackId: number;
}

export function ActionButton({ action, text, trackId }: EnrollButtonProps) {
  return (
    <Button
      onClick={async () => {
        try {
          await action(trackId);
          toast({
            title: 'Success',
            variant: 'success',
            description: <p>You're now successfully {text.toLowerCase()}ed the track.</p>,
          });
        } catch (error) {
          toast({
            title: `Please Login to continue`,
            variant: 'destructive',
            description:
              error instanceof Error ? (
                <p>
                  {error.message}{' '}
                  <a href={'/login'} className="font-bold underline">
                    Login
                  </a>
                </p>
              ) : (
                <p>There was an error trying to {text.toLowerCase()} you from the track.</p>
              ),
          });
        }
      }}
    >
      {text}
    </Button>
  );
}
