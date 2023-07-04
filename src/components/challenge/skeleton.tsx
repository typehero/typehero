'use client';

import { ChallengeLayout } from './challenge-layout';
import { DescriptionPanelSkeleton } from './description-panel-skeleton';

export function ChallengeSkeleton() {
  return <ChallengeLayout skeleton left={<DescriptionPanelSkeleton />} right={'Loading...'} />;
}
