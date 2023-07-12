import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export interface UserBadgeProps {
  username: string;
}

const UserBadge = (props: UserBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/@${props.username}`}>
          <Button
            className="h-fit w-fit rounded-full bg-neutral-200 p-1 px-2 text-xs font-bold text-neutral-500 hover:bg-neutral-300 dark:bg-zinc-700 dark:text-neutral-400 dark:hover:bg-neutral-500"
            size="sm"
          >
            @ {props.username}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <span>Author</span>
      </TooltipContent>
    </Tooltip>
  );
};

export { UserBadge };
