'use client';
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
      <I18nProviderClient locale={locale}>
        <main className="flex-1">{children}</main>
      </I18nProviderClient>
    </>
  );
}
