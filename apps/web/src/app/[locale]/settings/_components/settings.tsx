'use client';

import type { User } from '@repo/db/types';
import {
  Tabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from '@repo/ui/components/tabs';
import { Card } from '@repo/ui/components/card';
import { BellRing, Brush, Settings2, Shapes } from '@repo/ui/icons';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';
import { ProfileSettings } from './profile';
import { Notifications } from './notifications';
import { Appearances } from './appearance';
import { usePathname } from 'next/navigation';
import UserHeader from '../../[username]/_components/dashboard/user-header';
import { MagicIcon } from '@repo/ui/components/magic-icon';
import { stripProtocolAndWWW } from '~/utils/stringUtils';

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
  {
    icon: Shapes,
    name: 'Connections',
    link: '/settings/connections',
    disabled: true,
  },
  {
    icon: BellRing,
    name: 'Notifications',
    link: '/settings/notifications',
    disabled: true,
  },
];

export const Settings = ({ user }: Props) => {
  const path = usePathname();
  let selectedTabValue: string;
  if (path === '/settings') {
    selectedTabValue = 'profile';
  } else if (path === '/settings/connections') {
    selectedTabValue = 'connections';
  } else if (path === '/settings/notifications') {
    selectedTabValue = 'notifications';
  } else if (path === '/settings/appearance') {
    selectedTabValue = 'appearance';
  } else {
    // TODO: 404
    selectedTabValue = 'profile';
  }
  return (
    <div className="container">
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue={selectedTabValue}>
        <VerticalTabsList>
          <div className="mb-2 flex flex-col items-center md:items-start">
            <div
              className="mb-10 h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64"
              style={{ backgroundImage: `url(${user.image ?? '/avatar.jpeg'})` }}
            />
            <UserHeader user={user} isOwnProfile />
            <p
              className="text-sm italic tracking-tight text-neutral-500"
              title={`Joined ${user.createdAt.toString()}`}
            >
              Joined {getRelativeTime(user.createdAt)}
            </p>
            <div className="mb-4 mt-2 w-full text-center text-sm md:w-64 md:text-start">
              {user.bio}
            </div>
            {user.userLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                {user.userLinks
                  .filter((item) => item.url !== '')
                  .map((link) => (
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
          </div>
          <div className="flex gap-4 pr-6 md:flex-col">
            {links.map(({ icon: Icon, name, link, disabled }) => {
              const Comp = disabled ? 'div' : Link;
              return (
                <Comp href={link} key={name} className="w-full">
                  <VerticalTabsTrigger
                    className="flex w-full items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                    value={name.toLowerCase()}
                    key={name}
                    disabled={disabled}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:block">{name}</span>
                  </VerticalTabsTrigger>
                </Comp>
              );
            })}
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value={selectedTabValue}>
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            {selectedTabValue === 'profile' && <ProfileSettings user={user} />}
            {selectedTabValue === 'connections' && <div>Connections</div>}
            {selectedTabValue === 'notifications' && <Notifications user={user} />}
            {selectedTabValue === 'appearance' && <Appearances />}
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
};
