'use client';
import { useState, type ReactNode } from 'react';
import type { ChallengeRouteData } from '../[slug]/getChallengeRouteData';
import { ChallengeLayout, MOBILE_BREAKPOINT } from './challenge-layout';
import usePanelAdjustments from './usePanelAdjustments';
import { LeftWrapper } from '../[slug]/left-wrapper';
import { Wrapper } from '../[slug]/wrapper';
import { TourProvider } from '@reactour/tour';
import challengeSteps from './challenge-steps';

interface Props {
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  children: ReactNode;
}

interface Base {
  [key: string]: number | string;
}

export function ChallengeLayoutWrapper({ challenge, track, children }: Props) {
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
    <TourProvider
      steps={challengeSteps}
      styles={{
        popover: (base: Base) => ({
          ...base,
          '--reactour-accent': '#3078c5',
          borderRadius: 10,
          color: 'black',
        }),
        maskArea: (base: Base) => ({ ...base, rx: 10 }),
        maskWrapper: (base: Base) => ({ ...base, color: '#3078c5' }),
        badge: (base: Base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
        close: (base: Base) => ({ ...base, right: 'auto', left: 8, top: 8 }),
      }}
    >
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
    </TourProvider>
  );
}
