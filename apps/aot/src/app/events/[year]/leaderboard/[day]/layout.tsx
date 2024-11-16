import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';

export default function DailyLeaderboardLayout({
  params,
  children,
}: {
  params: { day: string; year: string };
  children: React.ReactNode;
}) {
  const day = Number(params.day);
  const year = Number(params.year);

  if (!isChallengeUnlocked(year, day)) return notFound();

  return <>{children}</>;
}
