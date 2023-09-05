import { useCallback, useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: (size: Size) => unknown,
) {
  const [attached, setAttached] = useState(false);

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          callback({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(ref.current);
      setAttached(true);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref, handleResize]);

  return attached;
}
