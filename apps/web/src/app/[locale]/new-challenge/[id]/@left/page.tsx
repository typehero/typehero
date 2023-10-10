import { Description } from "~/app/[locale]/challenge/_components/description";
import Headers from "../_components/header";
import { getChallengeInfo } from '~/app/[locale]/new-challenge/[id]/actions/challenge.actions';

export default async function LeftPage({ params }: { params: { id: string; }}) {
  const id = Number(params.id);
  const bob = await getChallengeInfo(id);
  return (
    <div className="relative h-full">
      <Description challenge={bob}/>
    </div>
  );
}
