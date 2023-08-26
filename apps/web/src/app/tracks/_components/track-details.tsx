'use client';

import { useSession } from '@repo/auth/react';
import { toast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EnrollButton } from './enroll-button';
import { enrollUserInTrack, getTrackDetails, unenrollUserFromTrack } from './track.action';

interface TrackDetailProps {
  // trackid
  slug: string;
}

export function TrackDetail({ slug }: TrackDetailProps) {
  const session = useSession();
  const router = useRouter();
  const trackId = parseInt(slug);
  const [trackChallenge, setTrackChallenge] = useState<Awaited<
    ReturnType<typeof getTrackDetails>
  > | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // things you need to do to skip first render & call server action on client component.
  // this is nightmare fuel.
  // todo: find better way
  useEffect(() => {
    (async () => {
      await loadPageData();
    })();
  }, []);

  const loadPageData = async () => {
    const trackChallenge = await getTrackDetails(trackId);
    setTrackChallenge(trackChallenge);
    if (session.status === 'authenticated') {
      const isEnrolled = trackChallenge?.enrolledUsers.findIndex(
        (user) => user.id === session.data.user.id,
      );
      if (isEnrolled !== -1) {
        setIsEnrolled(true);
      }
    }
  };

  async function handleEnrollUserInTrack() {
    try {
      await enrollUserInTrack(trackId);
      router.refresh();
      toast({
        title: 'Enrolled',
        description: "You're now successfully enrolled in the track.",
        variant: 'success',
      });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.log(e);
      }
      toast({
        title: 'Oops!',
        description: 'There was an error while trying to enroll you in the track.',
        variant: 'destructive',
      });
    }
  }

  async function handleUnenrollUserFromTrack() {
    try {
      await unenrollUserFromTrack(trackId);
      router.refresh();
      toast({
        title: 'Unenrolled',
        description: "You're now successfully unenrolled from the track.",
        variant: 'success',
      });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.log(e);
      }
      toast({
        title: 'Oops!',
        description: 'There was an error while trying to unenroll you in the track.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container flex flex-col gap-8 py-5 md:gap-16 md:pb-20">
      <div className="container">
        <h3 className="mb-1 text-2xl font-bold tracking-wide text-neutral-900/40 dark:text-white/40">
          Track
        </h3>
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {trackChallenge?.title}
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          {trackChallenge?.description}
        </p>
      </div>
      {session.status === 'authenticated' && (
        <div className="flex flex-row">
          {!isEnrolled ? (
            <EnrollButton action={handleEnrollUserInTrack} text="Enroll" />
          ) : (
            <EnrollButton action={handleUnenrollUserFromTrack} text="Unenroll" />
          )}
        </div>
      )}
    </div>
  );
}
