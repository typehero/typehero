'use client';

import { signIn, signOut, useSession } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Loader2, LogIn, Moon, Sun, User } from '@repo/ui/icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navigation() {
  return (
    <header className="z-0 w-full">
      <nav className="flex h-14 items-center px-4">
        <div className="flex w-full items-center justify-between">
          <div className="relative flex gap-3">
            <Link className="flex items-center space-x-2 duration-300" href="/">
              <svg
                className="h-8 w-8 rounded-md bg-[#3178C6] p-[2px]"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="38" height="38" rx="4.5" fill="#3178C6" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.6947 20.9344H20V18H8V20.9344H12.2842V34H15.6947V20.9344Z"
                  fill="white"
                />
                <path
                  d="M22 34V18H25.4511V24.6309H30.5405V18H34V34H30.5405V27.3458H25.4511V34H22Z"
                  fill="white"
                />
              </svg>

              <span className="font-bold leading-3">
                type
                <br />
                hero
              </span>
            </Link>
          </div>
          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              <ThemeButton />
              <LoginButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <button
          aria-label="theme button"
          className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none"
          onClick={() => {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          }}
          type="button"
        >
          {resolvedTheme === 'dark' && <Moon aria-hidden="true" className="h-5 w-5" />}
          {resolvedTheme === 'light' && <Sun aria-hidden="true" className="h-5 w-5" />}
        </button>
      ) : null}
    </>
  );
}

function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  // NOTE: 1. loading == true -> 2. signIn() -> 3. session status == 'loading' (loading == false)
  const handleSignIn = async () => {
    try {
      setLoading(true);
      // page reloads after sign in, so no need to setLoading(false), othersiwe ugly visual glitch
      await signIn('github', { redirect: false });
    } catch (error) {
      // only set loading to false if there was an error and page didn't reload after sign in
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    // whatever
    window.location.reload();
  };

  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="profile button"
          className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none"
        >
          <User className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] w-56 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
      >
        <Button
          className="h-8 w-full justify-start rounded-b-lg rounded-t-sm bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500"
          onClick={handleSignOut}
          variant="ghost"
        >
          <span className="text-red-500">Log out</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      className="focus:bg-accent w-20 rounded-lg bg-transparent p-2 text-black duration-300 hover:bg-gray-200 focus:outline-none dark:text-white hover:dark:bg-gray-800"
      disabled={loading || status === 'loading'}
      onClick={handleSignIn}
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
}
