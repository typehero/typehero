import DailyLeaderboard from '../../../[year]/leaderboard/_components/daily-leaderboard';
import { YEAR } from '../../date_constants';

export default function Page({ params: { day } }: { params: { day: string } }) {
  return <DailyLeaderboard adventYear={YEAR.toString()} adventDay={day} />;
}
