'use client';

import { SessionProvider } from '@repo/auth/react';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { ThemeProvider } from 'next-themes';
import { TRPCReactProvider } from '~/trpc/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}
