import { hasAdventStarted } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../../../coming-soon';
import { NavLink } from '~/components/navigation/nav-link';

export default async function LeaderboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { year: string };
}) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return <ComingSoon />;
  }

  const year = Number(params.year);

  if (!hasAdventStarted(year)) return notFound();

  return (
    <>
      <TempSubNav year={year} />
      {children}
    </>
  );
}

const TempSubNav = ({ year }: { year: number }) => {
  return (
    <div className="flex py-10">
      <NavLink title="Challenges" href={`/events/${year}`} />
      <NavLink title="Leaderboard" href={`/events/${year}/leaderboard`} />
    </div>
  );
};
