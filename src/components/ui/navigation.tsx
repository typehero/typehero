'use client';

import { useTheme } from 'next-themes';

import Link from 'next/link';
import { LogIn, User, Bell, Moon, Sun, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useSession } from 'next-auth/react';

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  // NOTE: 1. loading == true -> 2. signIn() -> 3. session status == 'loading' (loading == false)
  const handleSignIn = async () => {
    setLoading(true);
    await signIn('github');
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full">
      <nav className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          <div className="relative flex basis-1/3">
            <a className="flex items-center space-x-2 duration-300" href="/">
              <svg
                className="h-6 w-6 rounded-md bg-indigo-500 p-[2px]"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1_2)">
                  <path
                    d="M462 0H50C22.3858 0 0 22.3858 0 50V462C0 489.614 22.3858 512 50 512H462C489.614 512 512 489.614 512 462V50C512 22.3858 489.614 0 462 0Z"
                    fill="#6366f1"
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
          </div>
          <NavigationMenu className="basis-1/3">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/explore" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Explore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <NavigationMenuTrigger>Something Nice</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>Nice</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex basis-1/3 items-center justify-end gap-2">
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

            <button
              type="button"
              className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="text-neutral-600 dark:text-neutral-400">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link className="block" href="/profile">
                    <DropdownMenuItem className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void handleSignOut()}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                disabled={loading || status === 'loading'}
                onClick={() => void handleSignIn()}
                className="rounded-lg bg-white p-2 text-black duration-300 focus:bg-accent focus:outline-none dark:bg-black dark:text-white"
              >
                {loading || status === 'loading' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
