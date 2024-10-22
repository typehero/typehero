import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { Providers } from './providers';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from './coming-soon';

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

  if (!enableAotPlatform) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <main>
            <ComingSoon />
          </main>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
