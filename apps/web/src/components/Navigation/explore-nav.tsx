'use client';
import clsx from 'clsx';
import Link from 'next/link';
import type { ChallengesByTagOrDifficulty } from '~/app/[locale]/explore/_components/explore.action';
import { usePathname } from 'next/navigation';
import { ProblemExplorerNav } from './problem-explorer-nav';

export interface AllChallenges {
  popularChallenges: ChallengesByTagOrDifficulty;
  beginnerChallenges: ChallengesByTagOrDifficulty;
  easyChallenges: ChallengesByTagOrDifficulty;
  mediumChallenges: ChallengesByTagOrDifficulty;
  hardChallenges: ChallengesByTagOrDifficulty;
  extremeChallenges: ChallengesByTagOrDifficulty;
}

interface ExploreNavProps {
  href: string;
  title: string;
  allChallenges: AllChallenges;
}

export function ExploreNav({ href, title, allChallenges }: ExploreNavProps) {
  const pathname = usePathname();
  if (pathname.startsWith('/challenge')) {
    return <ProblemExplorerNav allChallenges={allChallenges} />;
  }
  return (
    <Link href={href}>
      <div
        className={clsx('hover:text-foreground text-foreground/80 transition-colors', {
          '!text-foreground': pathname === href,
        })}
      >
        {title}
      </div>
    </Link>
  );
}
