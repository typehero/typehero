'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <div
        className={clsx(
          'rounded-full px-4 text-black/50 transition-colors duration-300 hover:text-black dark:text-white/80 dark:hover:text-yellow-400',
          {
            '!text-black dark:!text-white': pathname === href,
          },
          className,
        )}
      >
        {children}
      </div>
    </Link>
  );
}
