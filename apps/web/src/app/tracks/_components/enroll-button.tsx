'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/use-toast';
import { useMutation } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTRPC } from '~/trpc/react';

interface EnrollButtonProps {
  mode: 'enroll' | 'unenroll';
  trackId: number;
}

export function ActionButton({ mode, trackId }: EnrollButtonProps) {
  const path = usePathname();
  const router = useRouter();
  const trpc = useTRPC();
  const enroll = useMutation(trpc.track.enroll.mutationOptions());
  const unenroll = useMutation(trpc.track.unenroll.mutationOptions());
  const { mutateAsync, isPending } = mode === 'enroll' ? enroll : unenroll;
  const text = mode === 'enroll' ? 'Enroll' : 'Unenroll';

  return (
    <Button
      className="shadcnoverridetransition select-none rounded-3xl bg-black text-white shadow-[0px_16px_6px_-16px_#ff4,4px_2px_4px_-2px_#f4f,-4px_2px_4px_-2px_#4f4] hover:-translate-y-1 hover:bg-neutral-800 hover:shadow-[0px_16px_6px_-12px_#ff4,4px_6px_6px_-2px_#f4f,-4px_6px_6px_-2px_#4f4] active:translate-y-0 active:scale-[0.99] active:shadow-[0px_10px_3px_-16px_#ff4,8px_0px_2px_-2px_#f4f,-8px_0px_2px_-2px_#4f4] dark:bg-white dark:text-black dark:hover:bg-white dark:hover:brightness-125 dark:hover:saturate-150"
      disabled={isPending}
      onClick={async () => {
        try {
          await mutateAsync({ trackId });
          // The enrolled state and progress are server-rendered, so re-render them.
          router.refresh();

          toast({
            title: 'Success',
            variant: 'success',
            description: <p>You're now successfully {text.toLowerCase()}ed the track.</p>,
          });
        } catch (error) {
          if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
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
