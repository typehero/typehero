import type { Metadata } from 'next';
import { buildMetaForDefault } from './metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({});
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
