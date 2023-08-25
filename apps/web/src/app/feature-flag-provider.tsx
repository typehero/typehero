import { useQuery } from '@tanstack/react-query';
import { createContext, useState, type ReactNode } from 'react';

export const FeatureFlagContext = createContext<Record<string, boolean>>({});

interface Props {
  children: ReactNode;
}
export function FeatureFlagProvider({ children }: Props) {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  useQuery(['featureFlags'], () => fetch('/api/flags').then((res) => res.json()), {
    onSuccess: (data) => {
      setFeatureFlags(data);
    },
  });

  return <FeatureFlagContext.Provider value={featureFlags}>{children}</FeatureFlagContext.Provider>;
}
