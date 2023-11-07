import '../styles/globals.css';

import { Toaster } from '@repo/ui/components/toaster';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navigation } from '~/components/navigation';

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
              <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
              <p className="text-muted-foreground">
                The dashboard for all things moderation, administration, and more.
              </p>
            </div>
            <div className="bg-border my-6 h-[1px] w-full shrink-0" />
            <div className="h-full">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
