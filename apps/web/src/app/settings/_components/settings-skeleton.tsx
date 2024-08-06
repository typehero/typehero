import { Skeleton } from '@repo/ui/components/skeleton';

export function SettingsSkeleton() {
  return (
    <div className="container flex h-full flex-col gap-8 py-8 md:flex-row">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Skeleton className="h-32 w-32 rounded-3xl bg-cover md:h-64 md:w-64" />
          <Skeleton className="mt-4 h-10 w-60 rounded-lg bg-zinc-300 dark:bg-zinc-700 dark:text-white" />
          <div className="mt-4 flex gap-4 md:w-full md:flex-col">
            {Array.from({ length: 3 }, (_, idx) => (
              <TabsTriggerSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex shrink grow flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-700 py-10 md:w-2/3">
        <Skeleton className="h-4 w-5/6 max-w-80 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-60 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
        <Skeleton className="h-4 w-20 rounded-2xl bg-zinc-300 text-neutral-900 dark:bg-zinc-700 dark:text-white" />
      </div>
    </div>
  );
}

export function TabsTriggerSkeleton() {
  return (
    <div className="flex h-6 flex-row items-center gap-2 rounded-xl  border border-zinc-700 px-2 py-4 md:w-64">
      <Skeleton className="h-4 w-4 rounded-md border border-zinc-300 bg-zinc-300 dark:bg-zinc-700" />
      <Skeleton className="hidden h-4 w-16 rounded-2xl bg-zinc-300 text-neutral-900 md:block dark:bg-zinc-700 dark:text-white" />
    </div>
  );
}
