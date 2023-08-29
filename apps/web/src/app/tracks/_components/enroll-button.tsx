'use client';

import { Button, toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import type { enrollUserInTrack, unenrollUserFromTrack } from './track.action';

interface EnrollButtonProps {
  action: typeof enrollUserInTrack | typeof unenrollUserFromTrack;
  text: string;
  trackId: number;
}

export function EnrollButton({ action, text, trackId }: EnrollButtonProps) {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          await action(trackId);
          router.refresh();
          toast({
            title: 'Success',
            variant: 'success',
            description: <p>You're now successfully {text.toLowerCase()}ed the track.</p>,
          });
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.log(e);
          }
          toast({
            title: 'Error',
            variant: 'destructive',
            description: (
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
