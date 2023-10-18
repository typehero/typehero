'use client';

import type { User } from '@repo/db/types';
import {
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@repo/ui/components/tabs';
import { Brush, Settings2 } from '@repo/ui/icons';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

import { getRelativeTime } from '~/utils/relativeTime';
import UserHeader from '~/app/[locale]/[username]/_components/dashboard/user-header';
import { stripProtocolAndWWW } from '~/utils/stringUtils';

import { ProfileSettings } from './edit-profile-tab';
import { Appearances } from './edit-appearance-tab';

interface Props {
  user: User & { userLinks: { id: string | null; url: string }[] };
}

export const links = [
  {
    icon: Settings2,
    name: 'Profile',
    link: '/settings',
    disabled: false,
  },
  {
    icon: Brush,
    name: 'Appearance',
    link: '/settings/appearance',
    disabled: false,
  },
];

export const Settings = async ({ user }: Props) => {
  const filteredProfileLinks =
    user.userLinks.length > 0 ? user.userLinks.filter((item) => item.url !== '') : [];

  return (
    <div className="container">
      {/* // TODO: GFI: make each page a subroute, put settings & profile into the same layout */}
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="profile">
        <VerticalTabsList>
          <div className="flex flex-col items-center gap-10 md:items-start">
            <div
              className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
              <UserHeader user={user} isOwnProfile />
              <span
                className="text-muted-foreground text-sm italic tracking-tight"
                title={`Joined ${user.createdAt.toString()}`}
              >
                Joined {getRelativeTime(user.createdAt)}
              </span>
            </div>
            {Boolean(filteredProfileLinks.length > 0) && (
              <div className="flex w-full flex-col items-center gap-2 md:items-start">
                {filteredProfileLinks.map((link) => (
                  <div className="flex items-center gap-2" key={link.id}>
                    <MagicIcon url={link.url} />
                    <a
                      className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
                      href={link.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {stripProtocolAndWWW(link.url)}
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-4 md:w-full md:flex-col">
              <VerticalTabsTrigger
                className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                value="profile"
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden md:block">Profile</span>
              </VerticalTabsTrigger>
              <VerticalTabsTrigger
                className="flex items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                value="appearance"
              >
                <Brush className="h-4 w-4" />
                <span className="hidden md:block">Appearance</span>
              </VerticalTabsTrigger>
            </div>
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value="profile">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSettings user={user} />
            </CardContent>
          </Card>
        </VerticalTabsContent>
        <VerticalTabsContent className="shrink grow space-y-4" value="appearance">
          <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <Appearances />
            </CardContent>
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
};
