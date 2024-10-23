import { Skeleton } from '@repo/ui/components/skeleton';

export function PageContentSkeleton() {
  return (
    <div className="relative flex w-full shrink grow flex-col gap-8">
      <div className=" flex h-1/2 shrink grow flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-700 py-10 md:h-2/5 md:w-4/5">
        <Skeleton className="h-4 w-5/6 max-w-80 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-60 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-20 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
      </div>
      <div className="relative flex shrink grow flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-700 py-20 md:h-3/5">
        <Skeleton className="h-4 w-5/6 max-w-80 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-60 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-20 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="relative flex h-[300px] w-full shrink grow flex-col gap-8 md:h-[600px]">
      <div className="relative flex shrink grow flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-700 py-20 md:h-3/5">
        <Skeleton className="h-4 w-5/6 max-w-80 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-60 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-20 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
      </div>
    </div>
  );
}
