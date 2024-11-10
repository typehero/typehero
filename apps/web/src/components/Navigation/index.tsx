import { type Session } from '@repo/auth/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { ExternalLink, Palette, Play, Settings, Settings2, User } from '@repo/ui/icons';
import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '~/server/auth';
import { isAdmin, isAdminOrModerator } from '~/utils/auth-guards';
import { getAllFlags } from '~/utils/feature-flags';
import { Search } from '../search/search';
import { LoginLink } from './login-link';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { NavWrapper } from './nav-wrapper';
import { getNotificationCount } from './navigation.actions';
import { NotificationLink } from './notification-link';
import { SignOutLink } from './signout-link';
import { SkipToCodeEditor } from './skip-to-code-editor';
import { ThemeButton } from './theme-button';

export function getAdminUrl() {
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://admin.typehero.dev`;
  }

  // assume localhost
  return `http://localhost:3001`;
}

export async function Navigation() {
  const [session, featureFlags, notificationCount] = await Promise.all([
    auth(),
    getAllFlags(),
    getNotificationCount(),
  ]);
  const isAdminOrMod = isAdminOrModerator(session);
  const isAdminRole = isAdmin(session);

  const TopSectionLinks = (
    <>
      <NavLink title="Explore" href="/explore" />
      <NavLink title="Tracks" href="/tracks" />
      {featureFlags?.enableHolidayEvent ? (
        <div className="flex items-center gap-1">
          <NavLink title="Advent of TS" href="/aot-2023" />
        </div>
      ) : null}
    </>
  );

  const NavLinks = (
    <>
      <div className="hidden items-center gap-4 md:flex">{TopSectionLinks}</div>
      <div className="flex flex-col gap-5 pl-2 md:hidden">
        {TopSectionLinks}
        {!session?.user && (
          <div className="flex items-center gap-2">
            <span>Theme</span>
            <ThemeButton />
          </div>
        )}

        {session?.user ? (
          <>
            <hr />
            <NavLink title="Profile" href={`/@${session.user.name}`} />
            <NavLink title="Settings" href="/settings" />
            <div className="flex items-center gap-2">
              <span>Theme</span>
              <ThemeButton />
            </div>
            {isAdminOrMod ? <NavLink title="Admin" href={getAdminUrl()} /> : null}
            {isAdminOrMod ? (
              <NavLink title="Challenge Playground" href="/challenge-playground" />
            ) : null}
            {isAdminRole ? <NavLink title="URL Shortener" href="/share" /> : null}
            <SignOutLink className="px-0" />
          </>
        ) : (
          <LoginLink className="px-0 hover:bg-transparent hover:dark:bg-transparent" />
        )}
      </div>
    </>
  );

  return (
    <header className="w-full">
      <NavWrapper>
        <div className="flex w-full items-center justify-between">
          <div className="relative flex items-center gap-4">
            <SkipToCodeEditor />
            <Link className="flex space-x-1.5 focus:outline-none focus-visible:ring-2" href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 38 38"
                fill="none"
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

              <div className="font-bold leading-3">
                type
                <br />
                hero <span className="text-muted-foreground bg-muted px-1 text-xs">BETA</span>
              </div>
            </Link>
            <div className="hidden items-center md:flex md:gap-4">{NavLinks}</div>
          </div>

          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              <Suspense>
                <Search />
              </Suspense>
              <Link
                className="donate-btn relative overflow-hidden rounded-md border border-[#bea74b66] px-3 py-2 text-black duration-300 hover:bg-[#eed15f] dark:text-white dark:hover:bg-[#bea74b44]"
                href="/support"
              >
                Support Us
              </Link>
              {session ? <NotificationLink notificationCount={notificationCount} /> : null}
              {featureFlags?.enableLogin ? (
                <LoginButton isAdminOrMod={isAdminOrMod} session={session} isAdmin={isAdminRole} />
              ) : null}
              <MobileNav>{NavLinks}</MobileNav>
            </div>
          </div>
        </div>
      </NavWrapper>
    </header>
  );
}

async function LoginButton({
  isAdminOrMod,
  isAdmin,
  session,
}: {
  isAdminOrMod: boolean;
  isAdmin: boolean;
  session: Session | null;
}) {
  return session?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="profile button"
          className="hidden rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2 md:block"
        >
          <UserAvatar src={session.user.image ?? ''} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="mt-[0.33rem] w-56 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
      >
        <Link className="block" href={`/@${session.user.name}`}>
          <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link className="block" href={`/@${session.user.name}/settings`}>
          <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none">
            <Settings2 className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between rounded-lg px-2 py-0.5 text-sm ">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </div>
          <ThemeButton />
        </div>
        {isAdminOrMod ? (
          <Link className="block" href={getAdminUrl()}>
            <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
          </Link>
        ) : null}
        {isAdminOrMod ? (
          <Link className="block" href="/challenge-playground">
            <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
              <Play className="mr-2 h-4 w-4" />
              <span>Challenge Playground</span>
            </DropdownMenuItem>
          </Link>
        ) : null}
        {isAdmin ? (
          <Link className="block" href="/share">
            <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>URL Shortener</span>
            </DropdownMenuItem>
          </Link>
        ) : null}
        <DropdownMenuSeparator />

        <SignOutLink className="w-full rounded-b-lg rounded-t-sm" />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <span className="hidden md:flex">
      <LoginLink />
    </span>
  );
}
