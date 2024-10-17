import Link from 'next/link';
import { api } from '~/trpc/server';

export default async function Page() {
  const events = await api.event.getAll();
  return (
    <ul>
      {events.map((event) => {
        const year = event.slug.split('-').at(-1);
        return (
          <li key={event.slug}>
            <Link href={`/events/${year}`}>{year}</Link>
          </li>
        );
      })}
    </ul>
  );
}
