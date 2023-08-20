import '../styles/globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from '@repo/ui';
import { Providers } from './providers';
import { buildMeta } from './metadata';
import { Navigation } from '~/components/ui/navigation';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return buildMeta({
    title: 'Typehero',
    description: 'This is the home page',
  });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <title>Type Hero</title>
        <meta
          content="Level up your typescript skills with interactive exercises"
          name="description"
        />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="flex-1">
            <div className="h-full">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
