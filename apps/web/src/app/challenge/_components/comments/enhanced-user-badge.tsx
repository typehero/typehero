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
    staleTime: 60 * 1000,
  });
  const onMouseOver = () => {
    setQueryEnabled(true);
  };
  const gradient = getGradient(props.roles);
  const isCompact = query.isSuccess && query.data.bio === '' && query.data.titles.length < 1;

  return (
    <HoverCardWrapper
      usernameComponent={
        <Link href={`/@${props.username}`} className="focus:outline-none focus-visible:ring-0">
          <Button
            className="-ml-2 font-bold "
            asChild
            variant="ghost"
            size="xs"
            onMouseOver={onMouseOver}
          >
            <span
              className={cn('bg-gradient-to-r bg-clip-text font-bold text-transparent', gradient)}
            >
              @{props.username}
            </span>
          </Button>
        </Link>
      }
      onHoverComponent={
        //When a user does not have a bio & they have no titles, then a compact version is shown
        <Link href={`@${props.username}`}>
          <div className="flex w-max flex-row space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-fit max-w-[calc(39ch)] space-y-2">
                <h1
                  className={cn(
                    'inline-flex min-w-max bg-gradient-to-r bg-clip-text font-extrabold text-transparent',
                    gradient,
                  )}
                >
                  @{props.username}
                </h1>
              </div>
              <div>
                <div className={cn('w-min rounded-full bg-gradient-to-r p-0.5', gradient)}>
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={query.data?.image ?? ''} />
                    <AvatarFallback>{props.username.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            {query.isSuccess && !isCompact ? (
              <div className="flex max-w-72 flex-col space-y-2">
                <p className="line-clamp-2 text-sm font-light text-zinc-300">
                  {query.data.bio === '' ? 'This user has no bio' : query.data.bio}
                </p>
                <Titles data={query.data.titles} />
                <Badges data={query.data.badges} />
              </div>
            ) : null}
          </div>
        </Link>
      }
    />
  );
}

const TITLE_TO_ICON: Record<TitleInfo['type'], LucideIcon> = {
  admin: Shield,
  supporter: Sword,
  contributor: Wand2,
};

const TITLE_TO_CLASSNAME: Record<TitleInfo['type'], string> = {
  admin: 'from-rose-400 to-orange-300',
  contributor: 'bg-gradient-to-r from-sky-400 to-cyan-300',
  supporter: 'bg-gradient-to-r from-teal-200 to-teal-500',
};

function getGradient(roles: Role[]) {
  if (roles.find((r) => r.role === 'ADMIN')) {
    return TITLE_TO_CLASSNAME.admin;
  }
  if (roles.find((r) => r.role === 'CONTRIBUTOR')) {
    return TITLE_TO_CLASSNAME.contributor;
  }
  if (roles.find((r) => r.role === 'SUPPORTER')) {
    return TITLE_TO_CLASSNAME.supporter;
  }
  return 'text-foreground';
}

function Titles(props: { data: TitleInfo[] }) {
  return (
    <div className="flex flex-row space-x-2">
      {props.data.map((t) => {
        const Icon = TITLE_TO_ICON[t.type];
        return (
          <Badge
            className="rounded-full bg-gradient-to-br from-sky-600 to-sky-700 px-2  "
            key={t.type}
          >
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
    <div className="flex flex-row space-x-0.5">
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
      <HoverCardContent align="start" avoidCollisions={false} className="w-min rounded-lg ">
        {props.onHoverComponent}
      </HoverCardContent>
    </HoverCard>
  );
}
