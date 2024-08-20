import { Bell } from '@repo/ui/icons';
import clsx from 'clsx';
import Link from 'next/link';

export function NotificationLink() {
  const count = 4;
  return (
    <Link
      className=""
      href={{
        pathname: '/notifications',
      }}
    >
      <div className="relative flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <span
          className={clsx(
            "absolute right-[2%] top-[4%] grid min-h-[18px] min-w-[18px] -translate-y-2/4 translate-x-2/4 place-items-center rounded-full bg-red-500 text-xs font-medium leading-none text-white content-['']",
            count > 9 && 'w-7',
            count > 20 && 'w-8',
          )}
        >
          {count > 20 ? `${count}+` : count}
        </span>
      </div>
    </Link>
  );
}
