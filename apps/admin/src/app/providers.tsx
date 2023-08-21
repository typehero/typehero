'use client';

import { SessionProvider } from '@repo/auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@repo/ui';

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class">
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
