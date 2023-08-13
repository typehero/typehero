'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function ForceRenderUntilClient({ children }: { children: ReactNode }) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) return null;

  return children;
}
