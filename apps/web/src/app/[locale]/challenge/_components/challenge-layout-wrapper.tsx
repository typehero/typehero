'use client';
import { useState, type ReactNode } from 'react';
import type { ChallengeRouteData } from '../[id]/getChallengeRouteData';
import { ChallengeLayout, MOBILE_BREAKPOINT } from './challenge-layout';
import usePanelAdjustments from './usePanelAdjustments';
import { LeftWrapper } from '../[id]/left-wrapper';
import { Wrapper } from '../[id]/wrapper';

export function ChallengeLayoutWrapper({
  challenge,
  children,
}: {
  challenge: ChallengeRouteData;
  children: ReactNode;
}) {
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
        <LeftWrapper challengeId={challenge.id} expandPanel={expandPanel} isDesktop={isDesktop}>
          {children}
        </LeftWrapper>
      }
      right={<Wrapper challenge={challenge} />}
      {...props}
    />
  );
}
