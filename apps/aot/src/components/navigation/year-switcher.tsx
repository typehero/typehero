'use client';
import { YearSelector } from '@repo/ui/components/year-selector';
import { NavLink } from './nav-link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { atom, useAtom, useAtomValue } from 'jotai';
import { hasAdventEnded, hasAdventStarted } from '~/utils/time-utils';

//Need this atom to show the year on pages without /events/year, i.e index
//and about
const SelectedYearAtom = atom<string | undefined>(undefined);

const useUrlYear = () => {
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith('('));
  let urlYear = '2024';
  if (segments[0] === 'events' && segments[1]) urlYear = segments[1];
  return urlYear;
};

export function YearSwitcher(props: { className: string }) {
  const urlYear = useUrlYear();
  const [selectYear, setSelectYear] = useAtom(SelectedYearAtom);
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const isLive = hasAdventStarted(currentYear) && !hasAdventEnded(currentYear);

  function handleYearChange(newYear: string) {
    const newUrl = `/events/${newYear}`;
    router.push(newUrl);
    setSelectYear(newYear);
  }

  const ref = (node: HTMLDivElement | null) => {
    if (node !== null) {
      //After the element is rendered, set's the year to the year from the url
      setSelectYear(urlYear);
    }
  };

  return (
    <div className={props.className} ref={ref}>
      <YearSelector
        setSelectedYear={handleYearChange}
        //selected year is not available until first render, where the ref sets it to the url year.
        selectedYear={selectYear ?? urlYear}
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
