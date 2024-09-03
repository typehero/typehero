import '../styles/globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { Providers } from './providers';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex',
};
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>TypeHero Admin</title>
      </head>
      <body className={`${inter.className} flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="py-5">
            <div className="space-y-0.5 px-4">
              <h2 className="font-bold text-2xl tracking-tight">Admin</h2>
              <p className="text-muted-foreground">
                The dashboard for all things moderation, administration, and more.
              </p>
            </div>
            <div className="my-6 h-[1px] w-full shrink-0 bg-border" />
            <div className="h-full">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
