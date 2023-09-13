import { getRelativeTime } from '~/utils/relativeTime';

export default function RelativeTime({ date }: { date: Date }) {
  return <>{getRelativeTime(date)}</>;
}
