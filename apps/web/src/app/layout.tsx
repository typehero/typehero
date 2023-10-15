import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: 'TypeHero',
    default: 'Home',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
