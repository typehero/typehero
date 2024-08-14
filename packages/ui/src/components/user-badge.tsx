import type { NextjsLinkComponentType } from '../types';
import { Button } from './button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

export interface UserBadgeProps {
  username: string;
  linkComponent: NextjsLinkComponentType;
}

function UserBadge(props: UserBadgeProps) {
  const Link = props.linkComponent;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/@${props.username}`} className="focus:outline-none focus-visible:ring-0">
          <Button className="-ml-2 font-bold" variant="ghost" size="xs">
            +@{props.username}
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        avoidCollisions={false}
        className="rounded-2xl rounded-bl-sm px-3 py-1 text-xs invert"
      >
        <span>Author</span>
      </HoverCardContent>
    </HoverCard>
  );
}

export { UserBadge };
