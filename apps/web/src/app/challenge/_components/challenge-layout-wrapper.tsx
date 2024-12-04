'use client';
import { useState, type ReactNode, useEffect } from 'react';
import type { ChallengeRouteData } from '../[slug]/getChallengeRouteData';
import { ChallengeLayout, MOBILE_BREAKPOINT } from './challenge-layout';
import usePanelAdjustments from './usePanelAdjustments';
import { LeftWrapper } from '../[slug]/left-wrapper';
import { RightWrapper } from '../[slug]/right-wrapper';
import { useChallengeRouteData } from '../[slug]/challenge-route-data.hook';

interface ChallengeLayoutWrapperProps {
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  children: ReactNode;
}

export function ChallengeLayoutWrapper({
  challenge,
  track,
  children,
}: ChallengeLayoutWrapperProps) {
  const { setCurrentChallenge } = useChallengeRouteData();

  useEffect(() => {
    setCurrentChallenge(challenge);
  }, [challenge, setCurrentChallenge]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > MOBILE_BREAKPOINT);
  const [isReversed, setIsReversed] = useState(false);

  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;
  const { leftSide, adjustPanelSize, expandPanel, collapsePanel, isLeftPanelCollapsed } =
    usePanelAdjustments(DEFAULT_DESKTOP_WIDTH_PX, LEFT_PANEL_BREAKPOINT, isDesktop);

  const toggleDirection = () => {
    setIsReversed((prev) => !prev);
  };

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
      isReversed={isReversed}
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
      right={<RightWrapper track={track} challenge={challenge} toggleDirection={toggleDirection} />}
      {...props}
    />
  );
}
