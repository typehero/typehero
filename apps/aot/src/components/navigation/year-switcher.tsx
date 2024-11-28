'use client';
import { YearSelector } from '@repo/ui/components/year-selector';
import { useState } from 'react';
import { NavLink } from './nav-link';

export function YearSwitcher() {
  const [selectedYear, setSelectedYear] = useState('2024');

  return (
    <>
      <YearSelector setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
      <NavLink href={`/events/${selectedYear}`}>Event</NavLink>
      <NavLink href={`/leaderboard/${selectedYear}`}>Leaderboard</NavLink>
    </>
  );
}
