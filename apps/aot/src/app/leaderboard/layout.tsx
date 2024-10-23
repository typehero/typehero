import { getCurrentAdventDay, isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flag';
import { ComingSoon } from '../coming-soon';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { enableAotPlatform } = await getAllFlags();

  if (!enableAotPlatform) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <main>
            <ComingSoon />
          </main>
        </body>
      </html>
    );
  }

  const currentAdventDay = getCurrentAdventDay();
  if (!isValidAdventDay(currentAdventDay)) return notFound();

  return <>{children}</>;
}
