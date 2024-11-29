'use client';
import { YearSelector } from '@repo/ui/components/year-selector';
import { NavLink } from './nav-link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { atom, useAtom, useAtomValue } from 'jotai';
import { hasAdventEnded, hasAdventStarted } from '~/utils/time-utils';

//Need this atom to show the year on pages without /events/year, i.e index
//and about
const SelectedYearAtom = atom('2024');

export function YearSwitcher(props: { className: string }) {
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith('('));
  const [selectYear, setSelectYear] = useAtom(SelectedYearAtom);
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const isLive = hasAdventStarted(currentYear) && !hasAdventEnded(currentYear);

  function handleYearChange(newYear: string) {
    if (segments[0] === 'events') {
      const rest = segments.slice(2);
      const newUrl = `/events/${newYear}/${rest.join('/')}`;
      router.push(newUrl);
    }
    setSelectYear(newYear);
  }

  return (
    <div className={props.className}>
      <YearSelector
        setSelectedYear={handleYearChange}
        selectedYear={selectYear}
        showLive={isLive}
      />
    </div>
  );
}

export function NavLinksWithYear() {
  const year = useAtomValue(SelectedYearAtom);
  return (
    <>
      <NavLink href={`/events/${year}`}>Event</NavLink>
      <NavLink href={`/events/${year}/leaderboard`}>Leaderboard</NavLink>
    </>
  );
}
