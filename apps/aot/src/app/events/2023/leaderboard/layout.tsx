import { hasAdventStarted } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../../../coming-soon';
import { YEAR } from '../year';

export default async function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return <ComingSoon />;
  }

  if (!hasAdventStarted(YEAR)) return notFound();

  return <>{children}</>;
}
