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

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full border-b border-black dark:border-white">
      <nav className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Something Nice</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Nice</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Something Good
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4 pr-2">
            <button
              type="button"
              onClick={() => {
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
              }}
            >
              {resolvedTheme === 'dark' && <Moon className="h-6 w-6" aria-hidden="true" />}
              {resolvedTheme === 'light' && <Sun className="h-6 w-6" aria-hidden="true" />}
            </button>

            <button type="button">
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
