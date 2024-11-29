import type { Session } from '@repo/auth/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { Palette, Discord, NewTwitter, Github } from '@repo/ui/icons';
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
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { NavLinksWithYear, YearSwitcher } from './year-switcher';

const DISCORD_INVITE_LINK = 'https://discord.gg/trash-devs-796594544980000808';
const TWITTER_LINK = 'https://x.com/typeheroapp';
const GITHUB_LINK = 'https://github.com/typehero/typehero';

export async function Navigation() {
  const [session, featureFlags] = await Promise.all([auth(), getAllFlags()]);

  const TopSectionLinks = (
    <>
      {featureFlags.enableAotPlatform ? (
        <>
          <YearSwitcher className="hidden md:inline-flex" />
          <NavLinksWithYear />
          <NavLink href="/about">About</NavLink>
          <Separator className="md:hidden dark:bg-white/20" />
          <NavLink
            href={DISCORD_INVITE_LINK}
            className="flex flex-row items-center gap-2 text-black/40 md:hidden dark:text-white/60"
          >
            <span>Join us on Discord</span> <Discord className="h-4 w-4" />
          </NavLink>
          <NavLink
            href={TWITTER_LINK}
            className="flex flex-row items-center gap-2 text-black/40 md:hidden dark:text-white/60"
          >
            <span>Follow us on </span> <NewTwitter className="h-3.5 w-3.5" />
          </NavLink>
          <NavLink
            href={GITHUB_LINK}
            className="flex flex-row items-center gap-2 text-black/40 md:hidden dark:text-white/60"
          >
            <span>Contribute on </span> <Github className="h-3.5 w-3.5" />
          </NavLink>
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
          <div className="relative flex w-32 gap-3 lg:w-64">
            <Link className="flex items-center space-x-2 duration-300" href="/">
              <Logo />
            </Link>
          </div>
          <YearSwitcher className="md:hidden" />
          <div className="hidden items-center md:flex">{NavLinks}</div>
          <div className="flex items-center justify-end gap-1">
            <Button
              size="icon"
              variant="outline"
              asChild
              className="hidden border-none bg-transparent hover:bg-transparent md:flex dark:hover:text-yellow-400"
            >
              <Link href={DISCORD_INVITE_LINK}>
                <Discord />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="outline"
              asChild
              className="hidden border-none bg-transparent hover:bg-transparent md:flex dark:hover:text-yellow-400"
            >
              <Link href={GITHUB_LINK}>
                <Github />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="outline"
              asChild
              className="hidden border-none bg-transparent hover:bg-transparent md:flex dark:hover:text-yellow-400"
            >
              <Link href={TWITTER_LINK}>
                <NewTwitter />
              </Link>
            </Button>

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
