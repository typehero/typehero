'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProblemExplorerNav } from './problem-explorer-nav';

interface ExploreNavProps {
  href: string;
  title: string;
}

export function ExploreNav({ href, title }: ExploreNavProps) {
  const pathname = usePathname();
  if (pathname.startsWith('/challenge')) {
    return <ProblemExplorerNav />;
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
