import Link from 'next/link';
import { Carousel } from '~/components/carousel';
import { PersonalTrackCard } from './personal-track-card';
import type { EnrolledTracks } from './track.action';
import { EnrolledTrackCardSkeleton } from './enrolled-track-card-skeleton';
import { Suspense } from 'react';

export function EnrolledTrackSectionCarousel({ tracks }: { tracks: EnrolledTracks }) {
  return (
    <Carousel>
      {tracks.map((t) => (
        <Link
          className="group w-[250px] flex-none snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
          href={`/tracks/${t.slug}`}
          key={t.id}
        >
          <Suspense fallback={<EnrolledTrackCardSkeleton />}>
            <PersonalTrackCard track={t} />
          </Suspense>
        </Link>
      ))}
    </Carousel>
  );
}
