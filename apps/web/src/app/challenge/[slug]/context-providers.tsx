import React from 'react';
import { auth } from '@repo/auth/server';
import { getAllChallenges } from '~/app/explore/_components/explore.action';
import { isEnrolledInAnyTrack } from './getChallengeRouteData';
import { AllChallengesProvider } from './all-challenges.hook';
import { ProblemExplorerProvider } from '~/app/problem-explorer.hooks';
import { ChallegeRouteDataProvider } from './challenge-route-data.hook';

interface Props {
  children: React.ReactNode;
}

export async function ContextProviders({ children }: Props) {
  const allChallenges = await getAllChallenges();
  const session = await auth();
  const isExplorerDisabled = await isEnrolledInAnyTrack(session);
  return (
    <AllChallengesProvider AC={allChallenges}>
      <ProblemExplorerProvider isDisabled={isExplorerDisabled} AC={allChallenges}>
        <ChallegeRouteDataProvider>{children}</ChallegeRouteDataProvider>
      </ProblemExplorerProvider>
    </AllChallengesProvider>
  );
}
