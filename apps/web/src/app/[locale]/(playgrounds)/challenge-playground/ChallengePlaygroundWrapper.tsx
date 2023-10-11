'use client';

import { type ReactNode } from 'react';
import { ChallengeLayoutWrapper } from '../../challenge/_components/challenge-layout-wrapper';
import { useChallengePlaygroundStore } from './challenge-playground-store';
import type { ChallengeRouteData } from '../../challenge/[id]/getChallengeRouteData';

interface Props {
  children: ReactNode;
}

export function ChallengePlaygroundWrapper({ children }: Props) {
  const { values } = useChallengePlaygroundStore();

  const challenge = values.challenge as ChallengeRouteData;
  return <ChallengeLayoutWrapper challenge={challenge}>{children}</ChallengeLayoutWrapper>;
}
