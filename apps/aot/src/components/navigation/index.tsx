import type { Session } from '@repo/auth/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { Palette } from '@repo/ui/icons';
import Link from 'next/link';
import { auth } from '~/server/auth';
import { getAllFlags } from '~/utils/feature-flag';
import { LoginLink } from './login-link';
import Logo from './logo';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { NavWrapper } from './nav-wrapper';
import { SignOutLink } from './signout-link';
import { ThemeButton } from './theme-button';

export async function Navigation() {
  const [session, featureFlags] = await Promise.all([auth(), getAllFlags()]);

  const TopSectionLinks = (
    <>
      {featureFlags.enableAotPlatform ? (
        <>
          <NavLink title="About" href="/about" />
          <NavLink title="Events" href="/events/2024" />
        </>
      ) : null}
    </>
  );
  const NavLinks = (
    <>
      <div className="hidden items-center md:flex">{TopSectionLinks}</div>
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
            <div className="flex items-center gap-2">
              <span>Theme</span>
              <ThemeButton />
            </div>
            <SignOutLink className="px-0" />
          </>
        ) : (
          <LoginLink className="px-0 hover:bg-transparent hover:dark:bg-transparent" />
        )}
      </div>
    </>
  );

  return (
    <header className="z-50 w-full">
      <NavWrapper>
        <div className="flex w-full items-center justify-between">
          <div className="relative flex w-64 gap-3">
            <Link className="flex items-center space-x-2 duration-300" href="/">
              <Logo />
            </Link>
          </div>
          <div className="hidden items-center md:flex">{NavLinks}</div>
          <div className="flex w-64 items-center justify-end gap-2">
            <Link
              className="donate-btn relative overflow-hidden rounded-full px-4 py-2 text-black duration-300 hover:bg-[#eed15f] dark:text-white dark:hover:bg-[#bea74b44]"
              href="/support"
            >
              Support Us
            </Link>
            <LoginButton session={session} />
            <MobileNav>{NavLinks}</MobileNav>
          </div>
        </div>
      </NavWrapper>
    </header>
  );
}

async function LoginButton({ session }: { session: Session | null }) {
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
        <div className="flex items-center justify-between rounded-lg px-2 py-0.5 text-sm ">
          <div className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </div>
          <ThemeButton />
        </div>
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
