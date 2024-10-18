import { Skeleton } from '@repo/ui/components/skeleton';

export function SolutionsSkeleton() {
  return (
    <div className="flex flex-col space-y-10 px-4 py-3">
      {/* SOLUTION BUTTON */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-1/6  rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      {/* DIVIDER */}
      <div className="flex flex-col">
        <Skeleton className="w-6/6 h-1  rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      {/* SOLUTIONS */}
      <div className="prose-invert prose-h3:text-xl flex flex-col space-y-2">
        <Skeleton className="h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="w-6/6 h-10 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
