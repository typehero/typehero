import React from 'react';
import { Description } from "~/app/[locale]/challenge/_components/description";
import Headers from "../_components/header";
import { getChallengeInfo } from '~/app/[locale]/new-challenge/[id]/actions/challenge.actions';
import { Comments } from '~/app/[locale]/challenge/_components/comments';

export function generateMetadata() {
  return {
    title: 'fuck'
  };
}

export default async function LeftPage({ params }: { params: { id: string; }}) {
  const id = Number(params.id);
  const bob = await getChallengeInfo(id);
  
  return (
    <div className="relative h-full">
      <Headers slug="new-challenge" />
      <React.Suspense fallback={'Loading'}>
        <Description challenge={bob}/>
        <Comments rootId={bob.id} type="CHALLENGE" />
      </React.Suspense>
    </div>
  );
}
