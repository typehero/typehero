'use client';
import { type ReactNode, useEffect, useState } from 'react';
import { useChallengeRouteData } from '../[slug]/challenge-route-data.hook';
import type { ChallengeRouteData } from '../[slug]/getChallengeRouteData';
import { LeftWrapper } from '../[slug]/left-wrapper';
import { Wrapper } from '../[slug]/wrapper';
import { ChallengeLayout, MOBILE_BREAKPOINT } from './challenge-layout';
import usePanelAdjustments from './usePanelAdjustments';

interface Props {
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  children: ReactNode;
}

export function ChallengeLayoutWrapper({ challenge, track, children }: Props) {
  const { setCurrentChallenge } = useChallengeRouteData();

  useEffect(() => {
    setCurrentChallenge(challenge);
  }, [challenge, setCurrentChallenge]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > MOBILE_BREAKPOINT);
  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;
  const { leftSide, adjustPanelSize, expandPanel, collapsePanel, isLeftPanelCollapsed } =
    usePanelAdjustments(DEFAULT_DESKTOP_WIDTH_PX, LEFT_PANEL_BREAKPOINT, isDesktop);

  const props = {
    setIsDesktop,
    isDesktop,
    leftSide,
    adjustPanelSize,
    expandPanel,
    collapsePanel,
    isLeftPanelCollapsed,
  };

  return (
    <ChallengeLayout
      left={
        <LeftWrapper
          challenge={challenge}
          track={track}
          expandPanel={expandPanel}
          isDesktop={isDesktop}
        >
          {children}
        </LeftWrapper>
      }
      right={<Wrapper track={track} challenge={challenge} />}
      {...props}
    />
  );
}
