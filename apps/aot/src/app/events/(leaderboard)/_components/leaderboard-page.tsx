import type { Role } from '@repo/db/types';
import { Stage } from './stage';
import { LeaderboardTable } from './table';

export function LeaderboardPage(props: {
  isDayPage: boolean;
  data: {
    name: string;
    roles: Role[];
    bio: string;
    image: string | null;
    score: number | string;
  }[];
}) {
  return (
    <div>
      <div className="container fixed inset-0 top-32 ">
        <div className="top-32 mx-auto h-[220px] px-4 md:left-0 md:h-[330px] md:max-w-full lg:h-[500px]">
          <Stage data={props.data.slice(0, 3)} isDayStage={props.isDayPage} />
        </div>
      </div>
      <div className="border-[hsla(0, 0%, 100%, 0.12)] mx-auto mt-[255px] max-w-screen-lg rounded-2xl rounded-b-none border border-b-0 bg-[hsla(0,0%,0%,0.07)] px-2 pt-2 shadow-[0px_-18px_131px_-78px_hsla(132,100%,53%,0.3)] backdrop-blur-sm md:mt-[350px] lg:mt-[500px] dark:bg-[hsla(0,0%,100%,0.07)]">
        <div className="bg-background relative rounded-lg rounded-b-none">
          <LeaderboardTable data={props.data} isDayTable={props.isDayPage} />
        </div>
      </div>
    </div>
  );
}
