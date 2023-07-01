'use client';

import { useTheme } from 'next-themes';

import { User, Bell, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

export function Navigation() {
  const [mounted, setMounted] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

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
                {resolvedTheme === 'dark' && <Moon className="h-6 w-6" aria-hidden="true" />}
                {resolvedTheme === 'light' && <Sun className="h-6 w-6" aria-hidden="true" />}
              </button>
            )}

            <button
              type="button"
              className="rounded-lg p-2 duration-300 focus:bg-accent focus:outline-none"
            >
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            <Link href="/profile">
              <User className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
