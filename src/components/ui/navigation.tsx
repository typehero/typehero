'use client';

import { useTheme } from 'next-themes';

import { Bell, Moon, Sun } from 'lucide-react';
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
          <div className="flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span className="hidden font-bold sm:inline-block">type/hero</span>
            </a>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/explore" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Explore
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Something Nice</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Nice</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4 pr-2">
            {mounted && (
              <button
                type="button"
                onClick={() => {
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                }}
              >
                {resolvedTheme === 'dark' && <Moon className="h-6 w-6" aria-hidden="true" />}
                {resolvedTheme === 'light' && <Sun className="h-6 w-6" aria-hidden="true" />}
              </button>
            )}

            <button type="button">
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
