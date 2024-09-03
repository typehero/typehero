import { Skeleton } from '@repo/ui/components/skeleton';

export function SubmissionsSkeleton() {
  return (
    <div className="mb-0 flex flex-col space-y-10 px-4 pt-3">
      {/* ALL / ACCEPTED / REJECTED */}
      <div className="prose-invert flex align-center prose-h3:text-xl">
        <Skeleton className="mr-2 h-8 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="mr-2 h-8 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="mr-2 h-8 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      {/* DIVIDER */}
      <div className="flex flex-col">
        <Skeleton className=" h-1 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      {/* SUBMISSIONS */}
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-12 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
