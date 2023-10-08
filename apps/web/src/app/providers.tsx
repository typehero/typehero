'use client';

import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import React, { Suspense } from 'react';
import { Toolbar } from '~/components/toolbar';
import { I18nProviderClient } from '~/locales/client';
import en from '~/locales/en';
import { FeatureFlagProvider } from './feature-flag-provider';
import type { Corner } from '@tanstack/react-query-devtools/build/lib/utils';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  const position: Corner = 'top-right';
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position={position} />
      <SessionProvider>
        <ThemeProvider attribute="class">
          <FeatureFlagProvider>
            <TooltipProvider>
              <I18nProviderClient fallbackLocale={en}>{children}</I18nProviderClient>
            </TooltipProvider>
          </FeatureFlagProvider>
          <Suspense>
            <Toolbar />
          </Suspense>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
