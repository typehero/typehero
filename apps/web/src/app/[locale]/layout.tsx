import { getStaticParams } from '~/locales/server';

export function generateStaticParams() {
  return getStaticParams();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
