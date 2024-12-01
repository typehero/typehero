'use client';
import { useState, type ReactNode } from 'react';
import { LeftWrapper } from '../left-wrapper';
import { RightWrapper } from '../right-wrapper';
import { ChallengeLayout, MOBILE_BREAKPOINT } from './challenge-layout';
import type { Challenge } from './types';
import usePanelAdjustments from './usePanelAdjustments';

interface ChallengeLayoutWrapperProps {
  challenge: Challenge;
  children: ReactNode;
}

export function ChallengeLayoutWrapper({ challenge, children }: ChallengeLayoutWrapperProps) {
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
        <LeftWrapper expandPanel={expandPanel} isDesktop={isDesktop}>
          {children}
        </LeftWrapper>
      }
      right={<RightWrapper challenge={challenge} />}
      {...props}
    />
  );
}
