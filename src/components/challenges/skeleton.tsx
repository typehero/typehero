'use client';

import { ChallengeLayout } from './challenge-layout';
import { DescriptionPanelSkeleton } from './left-panel-skeleton';

export function ChallengeSkeleton() {
  return <ChallengeLayout skeleton left={<DescriptionPanelSkeleton />} right={'Loading...'} />;
}
