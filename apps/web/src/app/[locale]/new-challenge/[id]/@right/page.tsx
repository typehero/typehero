import { getServerAuthSession } from "@repo/auth/server";
import { CodePanel } from "@repo/monaco";
import { getChallengeRouteData } from "~/app/[locale]/challenge/[id]/getChallengeRouteData";
import { Wrapper } from "~/app/[locale]/challenge/[id]/wrapper";

export default async function RightPanel({ params } : { params: {id: string;}}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(params.id, session);

  return (
    <Wrapper challenge={challenge} />
  );
}