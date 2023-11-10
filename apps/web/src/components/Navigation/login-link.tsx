'use client';
import { LogIn } from '@repo/ui/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BLACKLISTED_LOGIN_REDIRECT_PATHS = ['/', '/login'];

export function LoginLink() {
  const pathname = usePathname();
  const isBlacklistedPath = BLACKLISTED_LOGIN_REDIRECT_PATHS.some((blacklistedPath) => {
    return blacklistedPath === pathname;
  });
  return (
    <Link
      className="focus:bg-accent w-20 rounded-lg bg-transparent p-2 text-black duration-300 hover:bg-gray-200 focus:outline-none dark:text-white hover:dark:bg-gray-800"
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
