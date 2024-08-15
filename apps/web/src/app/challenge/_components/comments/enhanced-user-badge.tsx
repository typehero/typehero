'use client';
import { UserBadge } from '@repo/ui/components/user-badge';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Shield, Sword, Wand2, type LucideIcon } from '@repo/ui/icons';
import { HolidayPlatinumBadge } from '~/app/(profile)/[username]/_components/badges/aot-2023-badge';
import { useQuery } from '@tanstack/react-query';
import { getProfileData, type TitleInfo } from './enhanced-user-badge.getProfileData';
import { useState } from 'react';
import { SlugToBadgeIcon } from '~/app/(profile)/[username]/_components/dashboard/badges';
import { type BadgeInfo } from '~/app/(profile)/[username]/_components/dashboard/_actions';

export function EnhancedUserBadge(props: { username: string }) {
  const [enabled, setEnabled] = useState(false);
  const query = useQuery({
    queryKey: ['profile-hover-card', props.username],
    queryFn: () => getProfileData(props.username),
    enabled,
  });
  const onMouseOver = () => {
    setEnabled(true);
  };
  return (
    <UserBadge username={props.username} linkComponent={Link} onMouseOver={onMouseOver}>
      <div className="flex flex-row space-x-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar>
            <AvatarImage src={query.data?.image ?? ''} />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          {query.isSuccess ? <Badges data={query.data.badges} /> : null}
        </div>
        <div className="space-y-2">
          <h1 className="text-md font-bold">@{props.username}</h1>
          {query.isSuccess ? <Titles data={query.data.titles} /> : null}
          <p className="text-sm ">{query.data?.bio}</p>
        </div>
      </div>
    </UserBadge>
  );
}

const SlugToTitleIcon: Record<TitleInfo['type'], LucideIcon> = {
  admin: Shield,
  supporter: Sword,
  contributor: Wand2,
};

function Titles(props: { data: TitleInfo[] }) {
  console.log({ props });
  return (
    <div className="flex flex-row space-x-2">
      {props.data.map((t) => {
        const Icon = SlugToTitleIcon[t.type];
        return (
          <Badge className="rounded-md" key={t.type}>
            <Icon className="h-5 w-5 pr-1" />
            {t.label}
          </Badge>
        );
      })}
    </div>
  );
}

function Badges(props: { data: BadgeInfo[] }) {
  const className = 'h-10 w-10';
  return (
    <div className="flex flex-row space-x-[-15px]">
      {props.data.map((b) => {
        const Icon = SlugToBadgeIcon[b.slug];
        return <Icon className="h-10 w-10" key={b.slug} />;
      })}
      <HolidayPlatinumBadge className={className} />
    </div>
  );
}
