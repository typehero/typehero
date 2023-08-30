import { useCallback, useEffect, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

const useResizeObserver = (ref: React.RefObject<HTMLElement>): Size | undefined => {
  const [size, setSize] = useState<Size>();

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    },
    [ref],
  );

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref, handleResize]);

  return size;
};

export default useResizeObserver;
