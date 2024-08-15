'use client';
import { UserBadge } from '@repo/ui/components/user-badge';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Sword } from '@repo/ui/icons';
import {
  HolidayBronzeBadge,
  HolidayGoldBadge,
  HolidayPlatinumBadge,
} from '~/app/(profile)/[username]/_components/badges/aot-2023-badge';
import { useQuery } from '@tanstack/react-query';
import { getProfileData } from './enhanced-user-badge.getProfileData';
import { useState } from 'react';

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
          <Badges />
        </div>
        <div className="space-y-2">
          <h1 className="text-md font-bold">@{props.username}</h1>
          <div className="flex flex-row space-x-2">
            <Flair text="Hero" />
            <Flair text="Wizard" />
            <Flair text="Admin" />
          </div>
          <p className="text-sm ">{query.data?.bio}</p>
        </div>
      </div>
    </UserBadge>
  );
}

function Flair(props: { text: string }) {
  console.log('flairs');
  return (
    <Badge className="rounded-md">
      <Sword className="h-5 w-5 pr-1" />
      {props.text}
    </Badge>
  );
}

function Badges() {
  const className = 'h-10 w-10';
  return (
    <div className="flex flex-row space-x-[-15px]">
      <HolidayGoldBadge className={className} />
      <HolidayBronzeBadge className={className} />
      <HolidayPlatinumBadge className={className} />
    </div>
  );
}
