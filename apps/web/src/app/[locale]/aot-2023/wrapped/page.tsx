import { Hero } from './_components/hero';
import { LeastSolved } from './_components/least-solved';
import { MostSolved } from './_components/most-solved';
import { UserSummary } from './_components/user-summary';

export default function AotWrappedPage() {
  return (
    <div>
      <Hero />
      <UserSummary />
      <MostSolved />
      <LeastSolved />
    </div>
  );
}
