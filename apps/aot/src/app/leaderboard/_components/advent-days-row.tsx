import Link from 'next/link';
import type { AdventDay } from '~/utils/time-utils';

export default function AdventDaysRow({
  currentAdventDay,
  selectedDay,
}: {
  currentAdventDay: AdventDay;
  selectedDay?: number;
}) {
  return (
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
                  day === selectedDay ? 'font-bold text-blue-600' : ''
                }`}
              >
                {day}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
