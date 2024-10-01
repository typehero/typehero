'use client';
import { useState, type ReactNode } from 'react';
import { PlaygroundLayout, MOBILE_BREAKPOINT } from './playground-layout';
import { usePanelDimensions } from './usePanelDimensions';
import { LeftPanel } from './left-panel/left-panel';

interface Props {
  children: ReactNode;
}

export function PlaygroundLayoutWrapper({ children }: Props) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > MOBILE_BREAKPOINT);
  const LEFT_PANEL_BREAKPOINT = isDesktop ? 500 : 318;
  const DEFAULT_DESKTOP_WIDTH_PX = `${LEFT_PANEL_BREAKPOINT}px`;
  const { rightPanelRef, adjustPanelSize, expandPanel, collapsePanel, isLeftPanelCollapsed } =
    usePanelDimensions(DEFAULT_DESKTOP_WIDTH_PX, LEFT_PANEL_BREAKPOINT, isDesktop);

  const props = {
    setIsDesktop,
    isDesktop,
    rightPanelRef,
    adjustPanelSize,
    expandPanel,
    collapsePanel,
    isLeftPanelCollapsed,
  };

  return <PlaygroundLayout left={<LeftPanel />} right={<div>im the right</div>} {...props} />;
}
