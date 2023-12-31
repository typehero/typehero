import React from 'react';
import { ChallegeRouteDataProvider } from '../challenge-route-data.hook';
import { ProblemExplorerProvider } from '../problem-explorer.hooks';
import { AllChallengesProvider } from '../all-challenges.hook';
import { getAllChallenges } from './explore/_components/explore.action';
import { auth } from '@repo/auth/server';
import { isEnrolledInAnyTrack } from './challenge/[slug]/getChallengeRouteData';
import { cookies } from 'next/dist/client/components/headers';
import type { ChallengeType } from '../get-challenges-and-title';

interface Props {
  children: React.ReactNode;
}

export async function ContextProviders({ children }: Props) {
  const allChallenges = await getAllChallenges();
  const session = await auth();
  const isExplorerDisabled = await isEnrolledInAnyTrack(session);
  const trackName = cookies().get('trackName')?.value as ChallengeType;
  return (
    <AllChallengesProvider AC={allChallenges}>
      <ProblemExplorerProvider
        isDisabled={isExplorerDisabled}
        AC={allChallenges}
        trackName={trackName}
      >
        <ChallegeRouteDataProvider>{children}</ChallegeRouteDataProvider>
      </ProblemExplorerProvider>
    </AllChallengesProvider>
  );
}
