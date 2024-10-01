import { useCallback, useMemo, useRef } from 'react';

export function usePanelDimensions(
  defaultDesktopWidth: string,
  leftPanelBreakpoint: number,
  isDesktop: boolean,
) {
  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  const expandPanel = useCallback(() => {
    if (!rightPanelRef.current) return;

    if (isDesktop) {
      rightPanelRef.current.style.width = defaultDesktopWidth;
      rightPanelRef.current.style.minWidth = defaultDesktopWidth;
    } else {
      rightPanelRef.current.style.height = defaultDesktopWidth;
      rightPanelRef.current.style.minHeight = defaultDesktopWidth;
    }
    rightPanelRef.current.style.opacity = '100%';
  }, [defaultDesktopWidth, isDesktop]);

  const collapsePanel = useCallback(() => {
    if (!rightPanelRef.current) return;
    if (isDesktop) {
      rightPanelRef.current.style.width = `0px`;
      rightPanelRef.current.style.minWidth = `0px`;
    } else {
      rightPanelRef.current.style.height = `0px`;
      rightPanelRef.current.style.minHeight = `0px`;
    }
  }, [isDesktop]);

  const isRightPanelCollapsed = useMemo(() => {
    if (!rightPanelRef.current) return false;

    const actualWidthInPixels = parseFloat(getComputedStyle(rightPanelRef.current).width);
    const actualHeightInPixels = parseFloat(getComputedStyle(rightPanelRef.current).height);

    return (
      (isDesktop && actualWidthInPixels < leftPanelBreakpoint) ||
      (!isDesktop && actualHeightInPixels < leftPanelBreakpoint)
    );
  }, [leftPanelBreakpoint, isDesktop]);

  const adjustPanelSize = useCallback(
    (divideByW: number, divideByH: number, newDimensionValue: number) => {
      if (!rightPanelRef.current) return;

      if (isRightPanelCollapsed) {
        expandPanel();
        return;
      }

      const panelSize = (newDimensionValue / 100) * (isDesktop ? divideByW : divideByH);
      const breakpointSize = isDesktop
        ? (leftPanelBreakpoint / divideByW) * 100
        : (leftPanelBreakpoint / divideByH) * 100;

      const sizeValue = panelSize < leftPanelBreakpoint ? breakpointSize : newDimensionValue;

      isDesktop
        ? (rightPanelRef.current.style.width = `${sizeValue}%`)
        : (rightPanelRef.current.style.height = `${sizeValue}%`);
    },
    [leftPanelBreakpoint, expandPanel, isDesktop, isRightPanelCollapsed],
  );

  return {
    rightPanelRef,
    adjustPanelSize,
    expandPanel,
    collapsePanel,
    isLeftPanelCollapsed: isRightPanelCollapsed,
  };
}
