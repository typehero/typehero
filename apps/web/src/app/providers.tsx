'use client';

import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { ThemeProvider } from 'next-themes';
import React, { Suspense } from 'react';
import { Toolbar } from '~/components/toolbar';
import { TRPCReactProvider } from '~/trpc/react';
import { FeatureFlagProvider } from './feature-flag-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TRPCReactProvider>
      <SessionProvider>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <FeatureFlagProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </FeatureFlagProvider>
          <Suspense>
            <Toolbar />
          </Suspense>
        </ThemeProvider>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
