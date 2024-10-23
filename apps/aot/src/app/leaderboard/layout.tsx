import { getCurrentAdventDay, isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../coming-soon';

export default async function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return <ComingSoon />;
  }

  const currentAdventDay = getCurrentAdventDay();
  if (!isValidAdventDay(currentAdventDay)) return notFound();

  return <>{children}</>;
}
