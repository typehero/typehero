import type { NextjsLinkComponentType } from '../types';
import { Button } from './button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import type { PropsWithChildren } from 'react';

export interface UserBadgeProps {
  username: string;
  linkComponent: NextjsLinkComponentType;
  onMouseOver?: () => void;
  className?: string;
}

function UserBadge(props: PropsWithChildren<UserBadgeProps>) {
  const Link = props.linkComponent;

  return (
    <HoverCard open={true}>
      <HoverCardTrigger asChild>
        <Link href={`/@${props.username}`} className="focus:outline-none focus-visible:ring-0">
          <Button
            className="-ml-2 font-bold"
            variant="ghost"
            size="xs"
            onMouseOver={props.onMouseOver}
          >
            <span className={props.className}>@{props.username}</span>
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="start" avoidCollisions={false} className="w-full">
        {props.children}
      </HoverCardContent>
    </HoverCard>
  );
}

export { UserBadge };
