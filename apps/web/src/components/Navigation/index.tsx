import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Play, Settings, Settings2, User } from '@repo/ui/icons';
import Link from 'next/link';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { getAllFlags } from '~/utils/feature-flags';
import { auth } from '@repo/auth/server';
import { ThemeButton } from './theme-button';
import { NavLink } from './nav-link';
import { NavWrapper } from './nav-wrapper';
import { LoginLink } from './login-link';
import { SignOutLink } from './signout-link';
import { getScopedI18n } from '~/locales/server';

export function getAdminUrl() {
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://admin.typehero.dev`;
  }

  // assume localhost
  return `http://localhost:3001`;
}

export async function Navigation() {
  const t = await getScopedI18n('navigation');
  const featureFlags = await getAllFlags();

  return (
    <header className="z-50 w-full">
      <NavWrapper>
        <div className="flex w-full items-center justify-between">
          <div className="relative flex items-center gap-3">
            <Link
              className="flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2"
              href="/"
            >
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

              <span className="font-bold leading-3">
                type
                <br />
                hero
              </span>
            </Link>
            {featureFlags?.enableExplore ? <NavLink title={t('explore')} href="/explore" /> : null}
            {featureFlags?.enableTracks ? <NavLink title={t('tracks')} href="/tracks" /> : null}
          </div>
          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              <ThemeButton />
              {featureFlags?.enableLogin ? <LoginButton /> : null}
            </div>
          </div>
        </div>
      </NavWrapper>
    </header>
  );
}

async function LoginButton() {
  const session = await auth();

  const isAdminOrMod = isAdminOrModerator(session);

  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="profile button"
          className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none focus-visible:ring-2"
        >
          <User className="h-5 w-5" />
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
        <Link className="block" href="/settings">
          <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none">
            <Settings2 className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        {isAdminOrMod ? (
          <a className="block" href={getAdminUrl()}>
            <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
          </a>
        ) : null}
        {isAdminOrMod ? (
          <a className="block" href="/challenge-playground">
            <DropdownMenuItem className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50">
              <Play className="mr-2 h-4 w-4" />
              <span>Challenge Playground</span>
            </DropdownMenuItem>
          </a>
        ) : null}
        <DropdownMenuSeparator />

        <SignOutLink />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <LoginLink />
  );
}
