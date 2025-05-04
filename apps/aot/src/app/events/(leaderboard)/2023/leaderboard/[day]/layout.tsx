import { isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { DAY } from '../../date_constants';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default async function DailyLeaderboardLayout(
  props: {
    params: Promise<{ day: string }>;
    children: React.ReactNode;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const day = Number(params.day);

  if (!isValidAdventDay(day)) return notFound();

  return children;
}
