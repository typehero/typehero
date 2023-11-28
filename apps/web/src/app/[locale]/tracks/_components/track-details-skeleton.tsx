import { Skeleton } from '@repo/ui/components/skeleton';

export function TrackDetailsSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="container mt-8 flex w-full flex-col justify-between gap-8 sm:flex-row sm:items-center sm:gap-8">
        <div className="h-24 w-1/12 flex-none items-center justify-center rounded-2xl sm:flex">
          <Skeleton className="h-24 w-24 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="flex w-full flex-col justify-start gap-2 ">
          <Skeleton className="float-left h-10 w-60 rounded-lg bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
          <Skeleton className="h-4 w-96 max-w-[69ch] rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="w-24">
          <Skeleton className="h-12 w-32 rounded-3xl bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>

      {/* Track Challenges */}
      <div className="mt-8 flex flex-col gap-2">
        {Array.from({ length: 10 }, (_, idx) => (
          <TrackChallengesSkeleton key={idx} />
        ))}
      </div>
    </>
  );
}

export function TrackChallengesSkeleton() {
  return (
    <div className="container">
      <div className=" flex h-12 w-full flex-row items-center justify-between rounded-lg bg-neutral-500/10 px-3 dark:from-neutral-900/70">
        <div className="flex flex-row gap-4">
          <Skeleton className="h-6 w-6 rounded-3xl border border-zinc-300 bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-6 w-24 rounded-lg border bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-6 w-40 rounded-lg border bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <Skeleton className="h-6 w-20 rounded-3xl bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
