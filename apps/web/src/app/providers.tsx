'use client';

import { VercelToolbar } from '@vercel/toolbar/next';
import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { FeatureFlagProvider } from './feature-flag-provider';
import { I18nProviderClient } from '~/locales/client';
import en from '~/locales/en';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class">
          <FeatureFlagProvider>
            <TooltipProvider>
              <I18nProviderClient fallbackLocale={en}>{children}</I18nProviderClient>
            </TooltipProvider>
          </FeatureFlagProvider>
          {shouldInjectToolbar ? <VercelToolbar /> : null}
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
