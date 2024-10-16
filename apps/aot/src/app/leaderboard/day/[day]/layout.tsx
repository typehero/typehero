import Link from 'next/link';
import { notFound } from 'next/navigation';
import { validateAdventDay } from '~/utils/time-utils';

export default function LeaderboardLayout({
  children,
  params: { day: routeDay },
}: {
  children: React.ReactNode;
  params: { day: number };
}) {
  const routeDayNum = Number(routeDay);
  const currentAdventDay = validateAdventDay(routeDayNum);
  if (currentAdventDay === undefined) return notFound();

  return (
    <>
      <div className="flex gap-2 text-xl">
        <p>Per day:</p>
        <ul className="flex gap-2">
          {Array.from({ length: currentAdventDay }, (_, index) => {
            const day = index + 1;
            return (
              <li key={day}>
                <Link
                  href={`/leaderboard/day/${day}`}
                  className={`hover:text-blue-400 ${
                    day === routeDayNum ? 'font-bold text-blue-600' : ''
                  }`}
                >
                  {day}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {children}
    </>
  );
}
