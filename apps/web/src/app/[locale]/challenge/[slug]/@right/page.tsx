import { auth } from '@repo/auth/server';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Wrapper } from '../wrapper';

export default async function EditorPage({ params: { slug } }: { params: { slug: string } }) {
  const session = await auth();
  const { challenge, track } = await getChallengeRouteData(slug, session);

  return <Wrapper track={track} challenge={challenge} />;
}
