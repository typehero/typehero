import { hasAdventStarted, isValidAdventYear } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../../../coming-soon';

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

  if (!isValidAdventYear(year) || !hasAdventStarted(year)) return notFound();

  return <>{children}</>;
}
