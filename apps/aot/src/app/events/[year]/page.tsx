import Link from 'next/link';
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
export default async function EventByYearLandingPage({ params: { year } }: Props) {
  const event = await api.event.getEventChallengesByYear({ year });
  const daysCompleted = event.trackChallenges.length;

  const daysLeftArray = Array.from({ length: 25 - daysCompleted }, (_, i) => daysCompleted + i + 1);

  return (
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
  );
}
