import React from 'react';
import { ChallegeRouteDataProvider } from '../challenge-route-data.hook';
import { SortingProvider, TrackProvider } from '../problem-explorer.hooks';
import { AllChallengesProvider } from '../all-challenges.hook';
import { getAllChallenges } from './explore/_components/explore.action';
import { auth } from '@repo/auth/server';
import { isEnrolledInAnyTrack } from './challenge/[slug]/getChallengeRouteData';

interface Props {
  children: React.ReactNode;
}

export async function ContextProviders({ children }: Props) {
  const allChallenges = await getAllChallenges();
  const session = await auth();
  const isExplorerDisabled = await isEnrolledInAnyTrack(session);
  return (
    <AllChallengesProvider AC={allChallenges}>
      <TrackProvider isDisabled={isExplorerDisabled} PC={allChallenges.popularChallenges}>
        <ChallegeRouteDataProvider>
          <SortingProvider>{children}</SortingProvider>
        </ChallegeRouteDataProvider>
      </TrackProvider>
    </AllChallengesProvider>
  );
}
