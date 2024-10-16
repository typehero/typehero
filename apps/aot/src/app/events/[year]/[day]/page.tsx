import { api } from '~/trpc/server';

interface Props {
  params: {
    day: string;
  };
}

export default async function Challenges({ params: { day } }: Props) {
  const events = await api.event.getByYear({ year: day });
}
