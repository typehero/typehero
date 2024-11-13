import { hasAdventStarted } from '~/utils/time-utils';
import { notFound, useSelectedLayoutSegment } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../../../coming-soon';
import { YEAR } from '../date_constants';
import { DayScroller } from './_components/day-scroller';

export default async function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return <ComingSoon />;
  }

  if (!hasAdventStarted(YEAR)) return notFound();

  return (
    <div className="container pt-8">
      <div className="container fixed inset-0 top-20">
        <DayScroller />
      </div>
      {children}
    </div>
  );
}
