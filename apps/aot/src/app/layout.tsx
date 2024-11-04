import './globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Advent of TypeScript',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
