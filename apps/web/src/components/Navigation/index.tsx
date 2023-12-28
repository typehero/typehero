import { auth } from '@repo/auth/server';
import { Badge } from '@repo/ui/components/badge';
import Link from 'next/link';
import { Suspense } from 'react';
import { getScopedI18n } from '~/locales/server';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { getAllFlags } from '~/utils/feature-flags';
import { Search } from '../search/search';
import { LoginButton } from './login-button';
import { LoginLink } from './login-link';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { NavWrapper } from './nav-wrapper';
import { SignOutLink } from './signout-link';
import { SkipToCodeEditor } from './skip-to-code-editor';

function getAdminUrl() {
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://admin.typehero.dev`;
  }

  // assume localhost
  return `http://localhost:3001`;
}

export async function Navigation() {
  const session = await auth();

  const isAdminOrMod = isAdminOrModerator(session);
  const t = await getScopedI18n('navigation');
  const featureFlags = await getAllFlags();

  const TopSectionLinks = (
    <>
      {featureFlags?.enableExplore ? <NavLink title={t('explore')} href="/explore" /> : null}
      {featureFlags?.enableTracks ? <NavLink title={t('tracks')} href="/tracks" /> : null}
      {featureFlags?.enableHolidayEvent ? (
        <div className="flex items-center gap-1">
          <NavLink title={t('advent')} href="/aot-2023" />
          <Badge className="h-4 bg-red-600 px-1.5" variant="default">
            New
          </Badge>
        </div>
      ) : null}
    </>
  );

  const NavLinks = (
    <>
      <div className="ml-4 hidden items-center gap-4 md:flex">{TopSectionLinks}</div>
      <div className="flex flex-col gap-5 pl-4 md:hidden">
        {TopSectionLinks}
        {session?.user ? (
          <>
            <hr />
            <NavLink title="Profile" href={`/@${session.user.name}`} />
            <NavLink title="Settings" href="/settings" />
            {isAdminOrMod ? <NavLink title="Admin" href={getAdminUrl()} /> : null}
            {isAdminOrMod ? (
              <NavLink title="Challenge Playground" href="/challenge-playground" />
            ) : null}
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
          <div className="relative flex items-center gap-3">
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
            <div className="hidden items-center md:ml-4 md:flex md:gap-4">{NavLinks}</div>
          </div>

          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              <Suspense>
                <Search />
              </Suspense>
              {featureFlags?.enableLogin ? <LoginButton adminUrl={getAdminUrl()} /> : null}
              <MobileNav>{NavLinks}</MobileNav>
            </div>
          </div>
        </div>
      </NavWrapper>
    </header>
  );
}
