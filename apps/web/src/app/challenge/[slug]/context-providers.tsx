import React from 'react';
import { getAllChallenges } from '~/app/explore/_components/explore.action';
import { ProblemExplorerProvider } from '~/app/problem-explorer.hooks';
import { auth } from '~/server/auth';
import { AllChallengesProvider } from './all-challenges.hook';
import { ChallegeRouteDataProvider } from './challenge-route-data.hook';
import { isEnrolledInAnyTrack } from './getChallengeRouteData';

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
