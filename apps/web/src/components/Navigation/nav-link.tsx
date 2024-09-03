'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <div
        className={clsx('text-foreground/80 transition-colors hover:text-foreground', {
          '!text-foreground': pathname === href,
        })}
      >
        {title}
      </div>
    </Link>
  );
}
