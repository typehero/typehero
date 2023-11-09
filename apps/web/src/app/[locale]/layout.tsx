import { Inter } from 'next/font/google';
import { getStaticParams } from '~/locales/server';
import Html from '../html';
import { Providers } from './providers';
import { Navigation } from '~/components/navigation';
import { Toaster } from '@repo/ui/components/toaster';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return getStaticParams();
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Providers locale={locale}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Toaster />
      </Providers>
      <Analytics />
    </>
  );
}
