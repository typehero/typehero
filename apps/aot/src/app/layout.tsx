import './globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { Navigation } from '~/components/navigation';
import { Providers } from './providers';
import { buildMetaForEventPage } from '~/utils/metadata';

const inter = Inter({
  subsets: ['latin'],
});

export function generateMetadata() {
  return buildMetaForEventPage();
}

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
