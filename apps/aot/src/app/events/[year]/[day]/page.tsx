import { api } from '~/trpc/server';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export default async function Challenges({ params: { year, day } }: Props) {
  const challenge = await api.event.getEventChallengeBySlug({ slug: `${year}-${day}` });

  return <pre>{JSON.stringify(challenge, null, 2)}</pre>;
}
