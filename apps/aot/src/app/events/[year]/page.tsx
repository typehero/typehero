import Link from 'next/link';
import { api } from '~/trpc/server';

interface Props {
  params: {
    year: string;
  };
}

export default async function EventByYearLandingPage({ params: { year } }: Props) {
  const event = await api.event.getEventChallengesByYear({ year });

  return (
    <div>
      <h1>Challenges for {year}</h1>
      <ul>
        {event.map((trackChallenge) => (
          <li key={trackChallenge.slug}>
            <Link href={`/events/${year}/${trackChallenge.slug.split('-').at(-1)}`}>
              {trackChallenge.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
