import { notFound } from 'next/navigation';
import { getServerAuthSession } from '../../../../../server/auth';
import { getChallengeRouteData } from '../../getChallengeRouteData';

interface Props {
  params: {
    id: string;
    solutionId: string;
  };
}

export default async function SolutionPage({ params: { id, solutionId } }: Props) {
  // const session = await getServerAuthSession();
  // const challenge = await getChallengeRouteData(id, session);
  //
  // if (!challenge) {
  //   return notFound();
  // }
  //
  return <div>some details go here for {solutionId}</div>;
}
