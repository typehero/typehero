'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <div
        className={clsx(
          'hover:text-foreground text-foreground/80 rounded-full px-4 py-1 transition-colors hover:bg-white/20',
          {
            '!text-foreground': pathname === href,
          },
        )}
      >
        {title}
      </div>
    </Link>
  );
}
