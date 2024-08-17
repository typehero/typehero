'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';
import { Shield, Sword, Wand2, type LucideIcon } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';
import { getProfileData, type TitleInfo } from './enhanced-user-badge.getProfileData';
import { useState } from 'react';
import { SlugToBadgeIcon } from '~/app/(profile)/[username]/_components/dashboard/badges';
import { type BadgeInfo } from '~/app/(profile)/[username]/_components/dashboard/_actions';
import { cn } from '@repo/ui/cn';
import type { Role } from '@repo/db/types';
import { Button } from '@repo/ui/components/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/ui/components/hover-card';

export function UserBadge(props: { username: string; roles: Role[] }) {
  const [queryEnabled, setQueryEnabled] = useState(false);
  const query = useQuery({
    queryKey: ['profile-hover-card', props.username],
    queryFn: () => getProfileData(props.username),
    enabled: queryEnabled,
  });
  const onMouseOver = () => {
    setQueryEnabled(true);
  };
  const textColor = getGradient(props.roles);
  const isCompact = query.isSuccess && query.data.bio === '' && query.data.titles.length < 1;
  return (
    <HoverCardWrapper
      usernameComponent={
        <Link href={`/@${props.username}`} className="focus:outline-none focus-visible:ring-0">
          <Button className="-ml-2 font-bold" variant="ghost" size="xs" onMouseOver={onMouseOver}>
            <span className={textColor}>@{props.username}</span>
          </Button>
        </Link>
      }
      onHoverComponent={
        //When a user does not have a bio & they have no titles, then a compact version is shown
        isCompact ? (
          <div className="flex flex-col items-center space-y-2">
            <h1 className={cn('text-md inline-flex font-bold', textColor)}>@{props.username}</h1>
            <Avatar>
              <AvatarImage src={query.data.image ?? ''} />
              <AvatarFallback>{query.data.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            {query.isSuccess ? <Badges data={query.data.badges} /> : null}
          </div>
        ) : (
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar>
                <AvatarImage src={query.data?.image ?? ''} />
                <AvatarFallback>{query.data?.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              {query.isSuccess ? <Badges data={query.data.badges} /> : null}
            </div>
            <div className="space-y-2">
              <h1 className={cn('text-md inline-flex font-bold', textColor)}>@{props.username}</h1>
              {query.isSuccess ? <Titles data={query.data.titles} /> : null}
              <p className="text-sm ">{query.data?.bio}</p>
            </div>
          </div>
        )
      }
    />
  );
}

const SlugToTitleIcon: Record<TitleInfo['type'], LucideIcon> = {
  admin: Shield,
  supporter: Sword,
  contributor: Wand2,
};

const SlugToClassName: Record<TitleInfo['type'], string> = {
  admin: 'from-rose-400 to-orange-300',
  contributor: 'bg-gradient-to-r from-sky-400 to-cyan-300',
  supporter: 'bg-gradient-to-r from-teal-200 to-teal-500',
};

function getGradient(roles: Role[]) {
  const gradient = 'bg-gradient-to-r bg-clip-text text-transparent ';
  if (roles.find((r) => r.role === 'ADMIN')) {
    return gradient + SlugToClassName.admin;
  }
  if (roles.find((r) => r.role === 'CONTRIBUTOR')) {
    return gradient + SlugToClassName.contributor;
  }
  if (roles.find((r) => r.role === 'SUPPORTER')) {
    return gradient + SlugToClassName.supporter;
  }
  return 'text-foreground';
}

function Titles(props: { data: TitleInfo[] }) {
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
  return (
    <div className="flex flex-row space-x-[-15px]">
      {props.data.map((b) => {
        const Icon = SlugToBadgeIcon[b.slug];
        return <Icon className="h-10 w-10" key={b.slug} />;
      })}
    </div>
  );
}

function HoverCardWrapper(props: {
  usernameComponent: React.ReactElement;
  onHoverComponent: React.ReactElement;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{props.usernameComponent}</HoverCardTrigger>
      <HoverCardContent align="start" avoidCollisions={false} className="w-full">
        {props.onHoverComponent}
      </HoverCardContent>
    </HoverCard>
  );
}
