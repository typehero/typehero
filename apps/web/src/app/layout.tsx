import { Providers } from './providers';

import '../styles/globals.css';

import { Inter } from 'next/font/google';
import { Navigation } from '~/components/ui/navigation';
import { Toaster } from '~/components/ui/toaster';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

const OG_IMAGE = '/real-og.png';
export async function generateMetadata(): Promise<Metadata> {
  const title = 'Type Hero';
  const description = 'Level up your typescript skills with interactive exercises';
  return {
    title,
    description,
    openGraph: {
      images: [OG_IMAGE],
      description,
      title,
      type: 'website',
    },
    twitter: {
      images: [OG_IMAGE],
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
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
