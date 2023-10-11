import { useCallback, useRef } from 'react';
import { COLLAPSED_DESKTOP_WIDTH, COLLAPSED_MOBILE_HEIGHT } from './challenge-layout';

const usePanelAdjustments = (
  DEFAULT_DESKTOP_WIDTH_PX: string,
  LEFT_PANEL_BREAKPOINT: number,
  isDesktop: boolean,
) => {
  const leftSide = useRef<HTMLDivElement | null>(null);

  const expandPanel = useCallback(() => {
    if (!leftSide.current) return;

    if (isDesktop) {
      leftSide.current.style.width = DEFAULT_DESKTOP_WIDTH_PX;
      leftSide.current.style.minWidth = DEFAULT_DESKTOP_WIDTH_PX;
    } else {
      leftSide.current.style.height = DEFAULT_DESKTOP_WIDTH_PX;
      leftSide.current.style.minHeight = DEFAULT_DESKTOP_WIDTH_PX;
    }
    leftSide.current.style.opacity = '100%';
  }, [DEFAULT_DESKTOP_WIDTH_PX, isDesktop]);

  const collapsePanel = useCallback(() => {
    if (!leftSide.current) return;
    if (isDesktop) {
      leftSide.current.style.width = `${COLLAPSED_DESKTOP_WIDTH}px`;
      leftSide.current.style.minWidth = `${COLLAPSED_DESKTOP_WIDTH}px`;
    } else {
      leftSide.current.style.height = `${COLLAPSED_MOBILE_HEIGHT}px`;
      leftSide.current.style.minHeight = `${COLLAPSED_MOBILE_HEIGHT}px`;
    }
  }, [isDesktop]);

  const isLeftPanelCollapsed = useCallback(() => {
    if (!leftSide.current) return false;

    const actualWidthInPixels = parseFloat(getComputedStyle(leftSide.current).width);
    const actualHeightInPixels = parseFloat(getComputedStyle(leftSide.current).height);

    return (
      (isDesktop && actualWidthInPixels < LEFT_PANEL_BREAKPOINT) ||
      (!isDesktop && actualHeightInPixels < LEFT_PANEL_BREAKPOINT)
    );
  }, [LEFT_PANEL_BREAKPOINT, isDesktop]);

  const adjustPanelSize = useCallback(
    (divideByW: number, divideByH: number, newDimensionValue: number) => {
      if (!leftSide.current) return;

      const isCollapsed = isLeftPanelCollapsed();

      if (isCollapsed) {
        expandPanel();
        return;
      }

      const panelSize = (newDimensionValue / 100) * (isDesktop ? divideByW : divideByH);
      const breakpointSize = isDesktop
        ? (LEFT_PANEL_BREAKPOINT / divideByW) * 100
        : (LEFT_PANEL_BREAKPOINT / divideByH) * 100;

      const sizeValue = panelSize < LEFT_PANEL_BREAKPOINT ? breakpointSize : newDimensionValue;

      isDesktop
        ? (leftSide.current.style.width = `${sizeValue}%`)
        : (leftSide.current.style.height = `${sizeValue}%`);
    },
    [LEFT_PANEL_BREAKPOINT, expandPanel, isDesktop, isLeftPanelCollapsed],
  );

  return {
    leftSide,
    adjustPanelSize,
    expandPanel,
    collapsePanel,
    isLeftPanelCollapsed,
  };
};

export default usePanelAdjustments;
