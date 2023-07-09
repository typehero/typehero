'use client';

import { useTheme } from 'next-themes';

import Link from 'next/link';
import { LogIn, Plus, Settings, User, Bell, Moon, Sun, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { navigationMenuTriggerStyle } from './navigation-menu';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useSession } from 'next-auth/react';
import { RoleTypes } from '@prisma/client';
import { isProd } from '~/utils/featureFlags';

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = session?.user?.role?.includes(RoleTypes.ADMIN);
  const isMod = session?.user?.role?.includes(RoleTypes.MODERATOR);
  const isAdminOrMod = isAdmin || isMod;

  // NOTE: 1. loading == true -> 2. signIn() -> 3. session status == 'loading' (loading == false)
  const handleSignIn = async () => {
    try {
      setLoading(true);
      // page reloads after sign in, so no need to setLoading(false), othersiwe ugly visual glitch
      await signIn('github');
    } catch (error) {
      // only set loading to false if there was an error and page didn't reload after sign in
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderLoginDetails = (): JSX.Element | null => {
    if (isProd()) return null;

    return session ? (
      <>
        <button
          type="button"
          className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4 w-56 rounded-xl">
            <Link className="block" href="/create">
              <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                <Plus className="mr-2 h-4 w-4" />
                <span>Create a Challange</span>
              </DropdownMenuItem>
            </Link>
            <Link className="block" href={`/@${session.user.name ?? ''}`}>
              <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            {isAdminOrMod && (
              <Link className="block" href="/admin">
                <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              className="h-8 w-full justify-start rounded-b-lg rounded-t-sm px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500"
              onClick={() => void handleSignOut()}
            >
              <span className="text-red-500">Log out</span>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    ) : (
      <Button
        disabled={loading || status === 'loading'}
        onClick={() => void handleSignIn()}
        className="w-20 rounded-lg bg-white p-2 text-black duration-300 hover:bg-gray-200 focus:bg-accent focus:outline-none dark:bg-black dark:text-white hover:dark:bg-gray-800"
      >
        {loading || status === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span className="dark:text-white">Login</span>
          </div>
        )}
      </Button>
    );
  };

  return (
    <header className="w-full">
      <nav
        className={`flex h-14 items-center ${
          pathname.includes('/challenge') || pathname.includes('/create') ? 'px-4' : 'container'
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="relative flex gap-3">
            <a className="flex items-center space-x-2 duration-300" href="/">
              <svg
                className="h-6 w-6 rounded-md bg-[#3178C6] p-[2px]"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1_2)">
                  <path
                    d="M462 0H50C22.3858 0 0 22.3858 0 50V462C0 489.614 22.3858 512 50 512H462C489.614 512 512 489.614 512 462V50C512 22.3858 489.614 0 462 0Z"
                    fill="#3178C6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M239.78 284.082H304V243H125V284.082H188.906V467H239.78V284.082Z"
                    fill="white"
                  />
                  <path
                    d="M303.13 466.986V242.986H349.72V335.818H418.427V242.986H465.13V466.986H418.427V373.827H349.72V466.986H303.13Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_2">
                    <rect width="512" height="512" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span className="font-bold leading-3">
                type
                <br />
                hero
              </span>
            </a>

            {!isProd() && (
              <Link href="/explore" legacyBehavior passHref>
                <Button variant="ghost" className={navigationMenuTriggerStyle()}>
                  Explore
                </Button>
              </Link>
            )}
          </div>
          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              {mounted && (
                <button
                  type="button"
                  className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none"
                  onClick={() => {
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                  }}
                >
                  {resolvedTheme === 'dark' && <Moon className="h-5 w-5" aria-hidden="true" />}
                  {resolvedTheme === 'light' && <Sun className="h-5 w-5" aria-hidden="true" />}
                </button>
              )}

              {renderLoginDetails()}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
