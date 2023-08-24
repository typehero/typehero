'use client';

import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { SessionProvider } from '@repo/auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@repo/ui';
import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
export const FeatureFlagContext = React.createContext<Record<string, boolean>>({});

export function Providers({ children }: Props) {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  useEffect(() => {
    fetch('/api/flags')
      .then((res) => res.json())
      .then((data) => {
        setFeatureFlags(data);
      });
  }, []);

  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      <BalancerProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeProvider attribute="class">
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </BalancerProvider>
    </FeatureFlagContext.Provider>
  );
}
