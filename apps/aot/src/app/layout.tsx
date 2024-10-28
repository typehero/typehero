import './globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from './coming-soon';
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
  const { enableAotPlatform } = await getAllFlags();

  return (
    <html lang="en">
      <body className={inter.className}>
        {enableAotPlatform ? (
          <Providers>
            <Navigation />
            <main>{children}</main>
          </Providers>
        ) : (
          <ComingSoon />
        )}
        <Toaster />
      </body>
    </html>
  );
}
