import Link from 'next/link';
import { Carousel } from '~/components/carousel';
import { PersonalTrackCard } from './personal-track-card';
import type { EnrolledTracks } from './track.action';

export function EnrolledTrackSectionCarousel({ tracks }: { tracks: EnrolledTracks }) {
  return (
    <>
      <div className="container p-4">
        <h2 className="relative text-3xl font-bold tracking-tight">
          <div className="absolute -left-8 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
          Your Tracks
        </h2>
      </div>

      <section className="relative flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
        <Carousel>
          {tracks.map((t) => (
            <Link
              className="group w-[250px] flex-none snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
              href={`/tracks/${t.slug}`}
              key={t.id}
            >
              <PersonalTrackCard track={t} />
            </Link>
          ))}
        </Carousel>
      </section>
    </>
  );
}
