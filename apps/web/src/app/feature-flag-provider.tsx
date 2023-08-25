import { useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode } from 'react';

export const FeatureFlagContext = createContext<Record<string, boolean>>({});

interface Props {
  children: ReactNode;
}
export function FeatureFlagProvider({ children }: Props) {
  const { data: featureFlags } = useQuery(['featureFlags'], () =>
    fetch('/api/flags').then((res) => res.json()),
  );

  return <FeatureFlagContext.Provider value={featureFlags}>{children}</FeatureFlagContext.Provider>;
}
