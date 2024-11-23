import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import { getAllFlags } from '~/utils/feature-flag';
// import { buildMetaForEventPage } from '~/utils/metadata';

// export async function generateMetadata() {
//   return buildMetaForEventPage({
//     title: 'Advent of Typescript',
//     description: 'Advent of Typescript',
//   });
// }

export default async function YearsSelector() {
  const { enableAotPlatform } = await getAllFlags();
  if (!enableAotPlatform) {
    return notFound();
  }

  const events = await api.event.getAll();
  const currentYear = new Date().getFullYear();
  function isCurrent(year: string) {
    return year === currentYear.toString();
  }
  return (
    <ul className="container mx-auto flex justify-center gap-4">
      {events.reverse().map((event) => {
        const year = event.slug.split('-').at(-1);
        return (
          <li
            className={`flex items-center gap-2 rounded-full border bg-gradient-to-r ${
              year && isCurrent(year)
                ? 'border-red-800 from-red-950 to-red-700'
                : 'border-emerald-800 from-emerald-700 to-emerald-900'
            } px-3 py-1.5 font-medium`}
            key={event.slug}
          >
            {year && isCurrent(year) ? (
              <>
                <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                <div className="-ml-4 h-2 w-2 rounded-full bg-red-500" />
              </>
            ) : null}
            <Link href={`/events/${year}`}>{year}</Link>
          </li>
        );
      })}
    </ul>
  );
}
