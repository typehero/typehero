import { getRelativeTime } from '~/utils/relativeTime';

type Props = {
  userId: string;
  text: string;
  createdAt: Date;
};

const Comment = ({ userId, text, createdAt }: Props) => {
  return (
    <div className="flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-neutral-700">
      <p>{text}</p>
      <div className="space-x-2">
        <span className="max-w-fit rounded-lg bg-neutral-200 pl-1 pr-2 font-bold dark:bg-neutral-700 dark:text-neutral-300">
          @{userId}
        </span>
        <span>{getRelativeTime(createdAt)}</span>
      </div>
    </div>
  );
};

export default Comment;
