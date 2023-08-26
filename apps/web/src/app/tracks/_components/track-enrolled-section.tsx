import Link from 'next/link';
import { Carousel } from '~/components/ui/carousel';
import type { EnrolledTracks } from '.';
import { PersonalTrackCard } from './personal-track-card';

interface EnrolledTrackSectionProps {
  title: string;
  tracks: EnrolledTracks;
}

export const EnrolledTrackSection = ({ title, tracks }: EnrolledTrackSectionProps) => {
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2 className={`relative text-3xl font-bold tracking-tight`}>
          <div
            className={`absolute -left-8 -z-10 h-12 w-32 rounded-full bg-pink-300/50 blur-3xl`}
          />
          {title}
        </h2>
      </div>
      <section className="relative flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
        <Carousel>
          {tracks.map((t) => (
            <Link
              className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
              href={`/tracks/${t.id}`}
              key={t.id}
            >
              <PersonalTrackCard track={t} />
            </Link>
          ))}
          {tracks.length == 0 && (
            <div className="w-full items-center" key={`helper-track`}>
              <div className="flex h-[30vh] flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">No Tracks Yet.</h1>
                <p className="text-xl">Start your journey by enrolling in a track.</p>
              </div>
            </div>
          )}
        </Carousel>
      </section>
    </div>
  );
};
