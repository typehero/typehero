'use client';
import { Navigation } from '~/components/navigation';
import { I18nProviderClient } from '~/locales/client';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </main>
    </>
  );
}
