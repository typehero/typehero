import ComingSoon from '~/app/coming-soon';
import { getAllFlags } from '~/utils/feature-flag';
import { getCurrentAdventDay, hasAdventStarted } from '~/utils/time-utils';
import { DayScroller } from '../../_components/day-scroller';
import { YEAR } from '../date_constants';

export default async function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return <ComingSoon />;
  }

  if (!hasAdventStarted(YEAR)) return <ComingSoon />;
  const eventDay = getCurrentAdventDay(YEAR);

  return (
    <div className="container mx-auto pt-8">
      <div className="container fixed inset-0 top-20">
        <DayScroller year={YEAR} eventDay={eventDay} />
      </div>
      {children}
    </div>
  );
}
