/*

  Once AoT starts, and all the implementation is finalized
  we can generate folders [_1, _25]
  each day we change from _1 -> 1 to make it valid and statically built
*/

import DailyLeaderboard from '../../_components/daily-leaderboard';

export default async function Page() {
  return <DailyLeaderboard adventDay={1} />;
}
