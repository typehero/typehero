import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { Wrapper } from './wrapper';
import { getChallengeRouteData } from './getChallengeRouteData';
import { getServerAuthSession } from '~/server/auth';

export default async function LayoutData({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);
  if (!challenge) return <div>loading</div>;

  return <ChallengeLayout left={children} right={<Wrapper challenge={challenge} />} />;
}
