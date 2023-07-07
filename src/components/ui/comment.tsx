import { getRelativeTime } from '~/utils/relativeTime';

type Props = {
  userId: string;
  text: string;
  createdAt: Date;
};

const Comment = ({ userId, text, createdAt }: Props) => {
  return (
    <div className="flex cursor-pointer flex-col gap-2 p-4 pt-2 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50">
      <div className="flex items-center gap-2">
        <span className="my-auto max-w-fit rounded-full bg-neutral-200 p-1 px-2 text-xs font-bold text-neutral-500 dark:bg-zinc-700 dark:text-neutral-400">
          @&nbsp;{userId}
        </span>
        <span className="text-sm text-neutral-500">{getRelativeTime(createdAt)}</span>
      </div>
      <p>{text}</p>
    </div>
  );
};

export default Comment;
