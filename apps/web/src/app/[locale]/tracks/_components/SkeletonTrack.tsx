import { Card } from '@repo/ui/components/card';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export function SkeletonTrack({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card
      className={clsx(
        'm-auto flex w-[300px] gap-4 bg-white bg-opacity-[.03] p-2 backdrop-blur-xl backdrop-filter md:m-0',
        className,
      )}
      {...rest}
    >
      <div className="h-16 w-16 flex-none rounded-2xl bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-3 w-2/3 rounded-lg bg-black bg-opacity-5 dark:bg-white  dark:bg-opacity-5" />
        <div className="h-2 w-full rounded-lg bg-black bg-opacity-5 dark:bg-white  dark:bg-opacity-5 " />
        <div className="h-2 w-full rounded-lg bg-black  bg-opacity-5 dark:bg-white  dark:bg-opacity-5" />
      </div>
    </Card>
  );
}
