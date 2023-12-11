'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  title,
  mobileView,
}: {
  href: string;
  title: string;
  mobileView?: boolean;
}) {
  const pathname = usePathname();
  return (
    <Link href={href} className={mobileView ? 'ml-4 md:hidden' : 'ml-4'}>
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
