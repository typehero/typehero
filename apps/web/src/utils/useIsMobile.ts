import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const isMobile = Boolean(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(userAgent),
    );

    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      setIsMobile(isSmall || isMobile);
      return;
    }

    setIsMobile(isSmall && isMobile);
  }, []);

  return isMobile;
}
