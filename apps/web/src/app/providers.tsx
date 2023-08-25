'use client';

import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { FeatureFlagProvider } from './feature-flag-provider';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <BalancerProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ThemeProvider attribute="class">
            <FeatureFlagProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </FeatureFlagProvider>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </BalancerProvider>
  );
}
