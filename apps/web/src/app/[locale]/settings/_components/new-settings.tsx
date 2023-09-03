'use client';

import type { User } from '@repo/db/types';
import { Card, Tabs, VerticalTabsContent, VerticalTabsList, VerticalTabsTrigger } from '@repo/ui';
import { BellRing, Brush, Settings2, Shapes } from 'lucide-react';
import Link from 'next/link';
import UserHeader from '~/components/user/dashboard/user-header';
import { getRelativeTime } from '~/utils/relativeTime';
import { ProfileSettings } from './profile';

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
    icon: Shapes,
    name: 'Connections',
    link: '/settings/connections',
    disabled: true,
  },
  {
    icon: BellRing,
    name: 'Notifications',
    link: '/settings/notifications',
    disabled: false,
  },
  {
    icon: Brush,
    name: 'Appearance',
    link: '/settings/appearance',
    disabled: false,
  },
];

export const NewSettings = ({ user }: Props) => {
  return (
    <div className="container">
      <Tabs className="flex flex-col gap-8 py-8 md:flex-row" defaultValue="profile">
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima temporibus maiores
              nesciunt hic dolores aspernatur corrupti laboriosam consectetur. Vitae, consectetur?
            </div>
          </div>
          <div className="flex gap-4 pr-6 md:flex-col">
            {links.map(({ icon: Icon, name, link, disabled }) => (
              <Link href={link} key={name} className="w-full">
                <VerticalTabsTrigger
                  className="flex w-full items-center justify-center gap-3 px-2 md:justify-normal md:px-3"
                  value={name.toLowerCase()}
                  key={name}
                  disabled={disabled}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{name}</span>
                </VerticalTabsTrigger>
              </Link>
            ))}
          </div>
        </VerticalTabsList>
        <VerticalTabsContent className="shrink grow space-y-4" value="profile">
          <Card className="col-span-4 min-h-[calc(100vh_-_56px_-_6rem)]">
            <ProfileSettings />
          </Card>
        </VerticalTabsContent>
      </Tabs>
    </div>
  );
};
