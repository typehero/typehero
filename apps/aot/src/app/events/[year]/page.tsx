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
        {event.trackChallenges.map((trackChallenge) => (
          <li key={trackChallenge.challenge.slug}>
            <Link href={`/events/${year}/${trackChallenge.challenge.slug.split('-').at(-1)}`}>
              {trackChallenge.challenge.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
// router.push(`/challenge/${challenge.slug}/submissions`);
