import { OG_URL, tagline } from './metadata';

export const metadata = {
  metadataBase: new URL(OG_URL),
  title: 'TypeHero',
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: 'TypeHero',
    description: tagline,
    siteName: 'TypeHero',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    title: 'TypeHero',
    card: 'summary_large_image',
    images: [
      {
        url: `${OG_URL}/api/default`,
        width: 1920,
        height: 1080,
      },
    ],
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
