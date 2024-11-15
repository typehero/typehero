import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import { getAllFlags } from '~/utils/feature-flag';
import { buildMetaForEventPage } from '~/utils/metadata';

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}

export default async function Page() {
  const { enableAotPlatform } = await getAllFlags();
  if (!enableAotPlatform) {
    return notFound();
  }

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
