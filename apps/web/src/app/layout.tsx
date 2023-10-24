import { baseMetadata } from './metadata';

export const metadata = {
  ...baseMetadata,
  title: 'TypeHero',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
