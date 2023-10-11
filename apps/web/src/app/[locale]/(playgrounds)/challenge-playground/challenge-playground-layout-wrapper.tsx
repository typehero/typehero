'use client';
import { useState, type ReactNode } from 'react';
import usePanelAdjustments from '../../challenge/_components/usePanelAdjustments';
import { LeftWrapper } from './left-wrapper';
import { Wrapper } from './wrapper';
import { ChallengeLayout, MOBILE_BREAKPOINT } from '../../challenge/_components/challenge-layout';

export function ChallengePlaygroundLayoutWrapper({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > MOBILE_BREAKPOINT);
  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;
  const { leftSide, adjustPanelSize, expandPanel, collapsePanel, isLeftPanelCollapsed } =
    usePanelAdjustments(DEFAULT_DESKTOP_WIDTH_PX, LEFT_PANEL_BREAKPOINT, isDesktop, true);

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
      left={<LeftWrapper>{children}</LeftWrapper>}
      right={<Wrapper />}
      isPlayground
      {...props}
    />
  );
}
