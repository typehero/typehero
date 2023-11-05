import { getServerAuthSession } from "@repo/auth/server";
import type React from "react";
import { getChallengeRouteData } from "../../challenge/[id]/getChallengeRouteData";

export default async function NewChallengeLayout({
  left,
  right,
}: {left: React.ReactNode; right: React.ReactNode; children: React.ReactNode; params: { id: string; }}) {
  return (
    <div className="flex gap-4 px-8 h-full">
      <div className="flex-grow bg-zinc-800 rounded-lg relative h-full">
        {left}
      </div>
      <div className="flex-grow bg-zinc-800 rounded-lg">
        {right}
      </div>
    </div>
  );
}