'use client';

import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import React, { Suspense } from 'react';
import { Toolbar } from '~/components/toolbar';
import { FeatureFlagProvider } from '../feature-flag-provider';
import { ChallegeRouteDataProvider } from '../challenge-route-data.hook';
import { SortingProvider, TrackProvider } from '../problem-explorer.hooks';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <SessionProvider>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <FeatureFlagProvider>
            <ChallegeRouteDataProvider>
              <TrackProvider>
                <SortingProvider>
                  <TooltipProvider>{children}</TooltipProvider>
                </SortingProvider>
              </TrackProvider>
            </ChallegeRouteDataProvider>
          </FeatureFlagProvider>
          <Suspense>
            <Toolbar />
          </Suspense>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
