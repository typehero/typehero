import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import { buildMetaForEventPage } from '~/utils/metadata';
import { isValidAdventYear } from '~/utils/time-utils';
import DayActive from './day-active';
import DayInactive from './day-inactive';
import type { RouterOutputs } from '~/trpc/react';
import { DailyCountdownTimer } from '~/components/DailyCountdownTimer';
import BgDecorations from './24BgDecorations';
import Partners from '~/components/landing/Partners';
import GiftBox from './GiftBox';

type Challenge = RouterOutputs['event']['getEventChallengesByYear'][0];
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

export default async function EventByYearLandingPage({ params }: Props) {
  const year = Number(params.year);
  if (!isValidAdventYear(year)) return notFound();

  // this will only return challenges that have passed/currently active
  const activeEventChallenges = await api.event.getEventChallengesByYear({ year });
  const daysThatHavePassed = activeEventChallenges.length;

  const inactiveEventChallenges = Array.from({ length: 25 - daysThatHavePassed }, (_, i) => ({
    day: daysThatHavePassed + i + 1,
    hasSolved: false,
    active: false,
  })) as Challenge[];

  const eventChallenges = [...activeEventChallenges, ...inactiveEventChallenges];

  const firstTwentyTwo = eventChallenges.slice(0, 22);
  const groupedDays = groupDays(firstTwentyTwo);
  const lastThree = eventChallenges.slice(-3);

  return (
    <div className="-mt-14 flex min-h-screen flex-col items-center justify-between overflow-hidden bg-gradient-to-t from-neutral-400/10 to-transparent py-14">
      <div className="fixed left-0 top-0 -z-10 h-full w-full bg-[url('https://images.pexels.com/photos/724906/pexels-photo-724906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover opacity-10 blur-3xl" />
      <div className="container relative mx-auto">
        <BgDecorations />
        {/* <h1 className="mb-16 mt-8 text-center text-3xl font-bold lg:text-6xl">
          Challenges for {year}
        </h1> */}
        <ul className="z-10 flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
          {year === 2024 && (
            <div className="flex flex-col items-center pb-10">
              <DailyCountdownTimer />
            </div>
          )}
          {groupedDays.map((group, index) => (
            <div key={`row-${index}`} className="flex gap-2 sm:gap-3 md:gap-4">
              {group.map((day) => (
                <>
                  {day.active ? (
                    <Link key={`day-active-${day.day}`} href={`/events/${year}/${day.day}`}>
                      <DayActive day={day.day} hasSolved={day.hasSolved} />
                    </Link>
                  ) : (
                    <DayInactive key={`day-inactive-${day.day}`} day={day.day} />
                  )}
                </>
              ))}
            </div>
          ))}

          <div className="-mt-[4.5rem] flex">
            {lastThree.map((day, index) => (
              <>
                {day.active ? (
                  <Link key={day.day} href={`/events/${year}/${day.day}`}>
                    <GiftBox
                      day={day.day}
                      active={day.active}
                      index={index}
                      hasSolved={day.hasSolved}
                    />
                  </Link>
                ) : (
                  <GiftBox
                    key={day.day}
                    day={day.day}
                    active={day.active}
                    index={index}
                    hasSolved={day.hasSolved}
                  />
                )}
              </>
            ))}
          </div>
        </ul>
      </div>
      <div className="mt-20">
        <Partners />
      </div>
    </div>
  );
}

function groupDays(array: Challenge[]) {
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
