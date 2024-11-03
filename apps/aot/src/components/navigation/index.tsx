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
import Logo from './logo';
import { NavLink } from './nav-link';
import { Avatar, AvatarFallback, AvatarImage, DefaultAvatar } from '@repo/ui/components/avatar';

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="flex h-14 grid-cols-3 items-center justify-between px-4 xl:grid">
        <div className="relative flex gap-3">
          <Link className="flex items-center space-x-2 duration-300" href="/">
            <Logo />
          </Link>
        </div>
        <div className="mx-auto mt-32 hidden w-fit items-center rounded-full md:mt-0 md:flex">
          <NavLink title="About" href="/about" />
          <NavLink title="Leaderboard" href="/leaderboard" />
          <NavLink title="Events" href="/events" />
          {/* support button looks kinda out of place here */}
          <Link
            className="donate-btn relative overflow-hidden rounded-md border border-[#bea74b66] px-3 py-2 text-black duration-300 hover:bg-[#eed15f] dark:text-white dark:hover:bg-[#bea74b44]"
            href="/support"
          >
            Support Us
          </Link>
        </div>
        <div className="flex xl:ml-auto">
          <div className="flex items-center justify-end gap-2">
            <ThemeButton />
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

export function SimpleNavigation() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="flex h-14 grid-cols-2 items-center justify-between px-4 xl:grid">
        <div className="relative flex gap-3">
          <Link className="flex items-center space-x-2 duration-300" href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex xl:ml-auto">
          <div className="flex items-center justify-end gap-2">
            <Link
              className="donate-btn relative overflow-hidden rounded-md border border-[#bea74b66] px-3 py-2 text-black duration-300 hover:bg-[#eed15f] dark:text-white dark:hover:bg-[#bea74b44]"
              href="/support"
            >
              Support Us
            </Link>
            <LoginButton />
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
          className="hidden rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2 md:block"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user.image ?? ''} alt="user avatar" />
            <AvatarFallback>
              <DefaultAvatar />
            </AvatarFallback>
          </Avatar>
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
