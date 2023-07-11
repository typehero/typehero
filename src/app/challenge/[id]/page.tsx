import { notFound } from 'next/navigation';
import { Description } from '~/components/challenge/description';
import { getServerAuthSession } from '~/server/auth';
import { getChallengeRouteData } from './getChallengeRouteData';
import Comments from '~/components/challenge/comments';

interface Props {
  params: {
    id: string;
  };
}

export default async function Challenges({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) {
    return notFound();
  }

  return (
    <div className="relative flex h-full flex-col justify-between">
      <div className="px-4 py-3">
        <Description challenge={challenge}></Description>
      </div>

      <div className="sticky bottom-0 -mx-[1px] overflow-hidden rounded-xl border border-zinc-300 border-b-background bg-background/90 shadow-[0_0_3rem_-0.25rem_#0004] backdrop-blur-sm duration-300 dark:border-zinc-700 dark:border-b-muted dark:bg-muted/90 dark:shadow-[0_0_3rem_-0.25rem_#0008]">
        <Comments challenge={challenge} />
      </div>
    </div>
  );
}
