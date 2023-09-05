import { useQuery } from '@tanstack/react-query';
import { createContext, type ReactNode } from 'react';

export const FeatureFlagContext = createContext<Record<string, boolean>>({});

interface Props {
  children: ReactNode;
}

const mockFlags = {
  loginButton: true,
  exploreButton: true,
  tracksButton: true,
};

const isProd = process.env.NODE_ENV === 'production';
export function FeatureFlagProvider({ children }: Props) {
  const { data: featureFlags } = useQuery(['featureFlags'], () => getFeatureFlags());

  return <FeatureFlagContext.Provider value={featureFlags}>{children}</FeatureFlagContext.Provider>;
}

async function getFeatureFlags() {
  if (isProd) {
    return fetch('/api/flags').then((res) => res.json());
  }

  return mockFlags;
}
