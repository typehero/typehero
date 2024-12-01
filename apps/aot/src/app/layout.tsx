import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@repo/ui/components/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Advent of TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
        </Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
