'use client';
import { LogIn } from '@repo/ui/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BLACKLISTED_LOGIN_REDIRECT_PATHS = ['/', '/login'];

export function LoginLink({ className }: { className?: string }) {
  const pathname = usePathname();
  const isBlacklistedPath = BLACKLISTED_LOGIN_REDIRECT_PATHS.some((blacklistedPath) => {
    return blacklistedPath === pathname;
  });
  return (
    <Link
      className={clsx(
        'focus:bg-accent w-20 rounded-md bg-transparent p-2 text-black duration-300 hover:bg-black/10 focus:outline-none dark:text-white dark:hover:bg-white/10 dark:hover:border-white/30 border hover:border-black/30 border-transparent',
        className,
      )}
      href={{
        pathname: '/login',
        query: {
          ...(!isBlacklistedPath && { redirectTo: pathname }),
        },
      }}
    >
      <div className="flex items-center space-x-2">
        <LogIn className="h-5 w-5" />
        <span className="dark:text-white">Login</span>
      </div>
    </Link>
  );
}
