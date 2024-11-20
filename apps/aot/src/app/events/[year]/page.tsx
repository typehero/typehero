import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import { buildMetaForEventPage } from '~/utils/metadata';
import { isValidAdventYear } from '~/utils/time-utils';
import gift1 from '~/../public/giftbox.png';
import gift2 from '~/../public/giftbox2.png';
import gift3 from '~/../public/giftbox3.png';
import DayLink from './DayLink';
import BgDecorations from './24BgDecorations';
import DayDisabled from './DayDisabled';

interface Props {
  params: {
    year: string;
  };
}

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}

const gifts = [gift1, gift2, gift3];

export default async function EventByYearLandingPage({ params }: Props) {
  const year = Number(params.year);
  if (!isValidAdventYear(year)) return notFound();

  const event = await api.event.getEventChallengesByYear({ year });
  const daysCompleted = event.trackChallenges.length;

  const daysLeftArray = Array.from({ length: 25 - daysCompleted }, (_, i) => daysCompleted + i + 1);

  function groupDays(array: number[]) {
    const grouped = [];
    let rowSize = 1; // Start with a row size of 1
    let i = 0;

    while (i < array.length) {
      grouped.push(array.slice(i, i + rowSize));
      i += rowSize;
      rowSize++; // Increase row size for the next group
    }

    return grouped;
  }

  const groupedDays = groupDays(daysLeftArray.slice(0, 22 - daysCompleted));
  const lastThree = daysLeftArray.slice(-3);

  return (
    <div className="-mt-14 flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-t from-neutral-400/10 to-transparent">
      {/* <div className="fixed left-0 top-0 -z-10 h-full w-full bg-[url('https://images.pexels.com/photos/724906/pexels-photo-724906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover opacity-100 blur-3xl" /> */}
      <div className="container relative mx-auto">
        {year === 2024 && BgDecorations()}
        {/* <h1 className="mb-16 mt-8 text-center text-3xl font-bold lg:text-6xl">
          Challenges for {year}
        </h1> */}
        <ul className="z-10 flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
          {event.trackChallenges.map((trackChallenge) => (
            <Link
              key={trackChallenge.challenge.slug}
              href={`/events/${year}/${trackChallenge.challenge.slug.split('-').at(-1)}`}
            >
              <DayLink day={Number(trackChallenge.challenge.name)} />
            </Link>
          ))}
          {groupedDays.map((group, index) => (
            <div key={index} className="flex gap-2 sm:gap-3 md:gap-4">
              {group.map((day) => (
                <DayDisabled day={day} key={day} />
              ))}
            </div>
          ))}
          <div className="-mt-[4.5rem] flex">
            {lastThree.map((day, index) => (
              <div
                key={day}
                className={`group relative h-12 w-12 cursor-pointer rounded-2xl duration-300 hover:bg-white/20 ${
                  index == 2 && 'ml-20 mr-12'
                }`}
              >
                <Image
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none brightness-100 grayscale group-hover:brightness-90 dark:brightness-50 ${
                    index == 0 && '-translate-y-[calc(50%+0.5rem)]'
                  }`}
                  src={gifts[index]!}
                  alt="Day 23"
                  width={64}
                  height={64}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
                  {day}
                </div>
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
