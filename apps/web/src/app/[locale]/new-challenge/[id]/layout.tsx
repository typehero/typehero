import { getServerAuthSession } from "@repo/auth/server";
import type React from "react";
import { getChallengeRouteData } from "../../challenge/[id]/getChallengeRouteData";

export default async function NewChallengeLayout({
  left,
  right,
}: {left: React.ReactNode; right: React.ReactNode; children: React.ReactNode; params: { id: string; }}) {
  // const session = await getServerAuthSession();
  // const challenge = await getChallengeRouteData(params.id, session);
  // console.info(challenge);
  return (
    <div className="flex gap-4 px-8 h-full">
      <div className="flex-grow bg-zinc-800 rounded-lg">
        {left}
      </div>
      <div className="flex-grow bg-zinc-800 rounded-lg">
        {right}
      </div>
    </div>
  );
}