import { Skeleton } from '@repo/ui/components/skeleton';

export function SuggestionsSkeleton() {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex h-10 w-full items-center justify-between rounded-3xl bg-neutral-500/10 px-3 lg:rounded-lg dark:from-neutral-900/70">
        <Skeleton className="h-6 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-6 w-14 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex h-10 w-full items-center justify-between rounded-3xl bg-neutral-500/10 px-3 lg:rounded-lg dark:from-neutral-900/70">
        <Skeleton className="h-6 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-6 w-14 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex h-10 w-full items-center justify-between rounded-3xl bg-neutral-500/10 px-3 lg:rounded-lg dark:from-neutral-900/70">
        <Skeleton className="h-6 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-6 w-14 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
