import AdventDaysRow from '../../_components/advent-days-row';

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdventDaysRow selectedDay={1} />
      {children}
    </>
  );
}
