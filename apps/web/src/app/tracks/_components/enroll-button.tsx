'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/use-toast';
import { useState } from 'react';
import type { enrollUserInTrack, unenrollUserFromTrack } from './track.action';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface EnrollButtonProps {
  action: typeof enrollUserInTrack | typeof unenrollUserFromTrack;
  text: string;
  trackId: number;
  slug: string;
}

export function ActionButton({ action, text, trackId, slug }: EnrollButtonProps) {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      className="shadcnoverridetransition select-none rounded-3xl bg-black text-white shadow-[0px_16px_6px_-16px_#ff4,4px_2px_4px_-2px_#f4f,-4px_2px_4px_-2px_#4f4] hover:-translate-y-1 hover:bg-neutral-800 hover:shadow-[0px_16px_6px_-12px_#ff4,4px_6px_6px_-2px_#f4f,-4px_6px_6px_-2px_#4f4] active:translate-y-0 active:scale-[0.99] active:shadow-[0px_10px_3px_-16px_#ff4,8px_0px_2px_-2px_#f4f,-8px_0px_2px_-2px_#4f4] dark:bg-white dark:text-black dark:hover:bg-white dark:hover:brightness-125 dark:hover:saturate-150"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);

        try {
          //i hate this
          const maybeAnError = await action(trackId, slug);
          if (maybeAnError === 'User is not logged in') {
            throw new Error('User is not logged in');
          }

          toast({
            title: 'Success',
            variant: 'success',
            description: <p>You're now successfully {text.toLowerCase()}ed the track.</p>,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (error.message === 'User is not logged in') {
              toast({
                title: 'Please Login to continue',
                variant: 'destructive',
                description: (
                  <p>
                    You must be logged in to enroll in a track.{' '}
                    <Link href={`/login?redirectTo=${path}`} className="font-bold underline">
                      Login
                    </Link>
                  </p>
                ),
              });
            } else {
              toast({
                title: 'Error',
                variant: 'destructive',
                description: (
                  <p>There was an error trying to {text.toLowerCase()} you from the track.</p>
                ),
              });
            }
          } else {
            toast({
              title: 'Unknown Error',
              variant: 'destructive',
              description: <p>Something went wrong</p>,
            });
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <>
        <svg
          className="-ml-2 mr-1.5 h-5 w-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
        >
          <path d="M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z" />
        </svg>
        {text}
      </>
    </Button>
  );
}
