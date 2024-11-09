import Link from 'next/link';
import { NavLink } from '~/components/navigation/nav-link';
import { api } from '~/trpc/server';
import { buildMetaForEventPage } from '~/utils/metadata';

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
  const event = await api.event.getEventChallengesByYear({ year });
  const daysCompleted = event.trackChallenges.length;

  const daysLeftArray = Array.from({ length: 25 - daysCompleted }, (_, i) => daysCompleted + i + 1);

  return (
    <>
      <TempSubNav year={year} />
      <div>
        <h1>Challenges for {year}</h1>
        <ul>
          {event.trackChallenges.map((trackChallenge) => (
            <li key={trackChallenge.challenge.slug}>
              <Link href={`/events/${year}/${trackChallenge.challenge.slug.split('-').at(-1)}`}>
                {trackChallenge.challenge.name}
              </Link>
            </li>
          ))}
          {daysLeftArray.map((day) => (
            <div key={day} className="day-left">
              Day {day}
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}

const TempSubNav = ({ year }: { year: number }) => {
  return (
    <div className="flex py-10">
      <NavLink title="Challenges" href={`/events/${year}`} />
      <NavLink title="Leaderboard" href={`/events/${year}/leaderboard`} />
    </div>
  );
};
