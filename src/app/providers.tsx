'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '~/components/ui/tooltip';

interface Props {
  children: React.ReactNode;
}
export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
