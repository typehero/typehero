import { getServerAuthSession, type Session } from '@repo/auth/server';
import { getCommentRouteData } from './getCommentRouteData';
import { getChallengeRouteData } from '../../getChallengeRouteData';
import { Description } from '~/app/[locale]/challenge/_components/description';
import { Comments } from '~/app/[locale]/challenge/_components/comments';
import { generateMetadata as challengeMetadata } from '../page';

interface Props {
  params: {
    id: string;
    commentId: string;
  };
}

export async function generateMetadata(props: Props) {
  if (props.params.commentId.trim().length == 0)
    return challengeMetadata({ params: { id: props.params.id } });

  // TODO: handle throws (here, and in ChallengeComments)
  const comment = await getCommentFromId(props);
  const challenge = await getChallengeRouteData(props.params.id, null);

  return {
    title: `${comment.user.name}'s reply to ${challenge.name} | TypeHero`,
    description: `${comment.user.name}: ${comment.text}. View this comment and others on TypeHero.`,
  };
}

async function getCommentFromId({ params: { id, commentId } }: Props) {
  const comment = await getCommentRouteData(id, commentId, null);
  return comment;
}

export default async function ChallengeComments({ params: { id, commentId } }: Props) {
  const session: Session | null = await getServerAuthSession();

  let comment = null;
  if (commentId.trim().length != 0) comment = await getCommentRouteData(id, commentId, session);

  const challenge = await getChallengeRouteData(id, session);

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments rootId={challenge.id} selectedComment={comment} type="CHALLENGE" />
    </div>
  );
}
