import { Skeleton } from '@repo/ui/components/skeleton';

export function DescriptionSkeleton() {
  return (
    <div className="flex flex-col space-y-10 px-4 py-3">
      <div className="prose-invert prose-h3:text-xl flex flex-col space-y-2">
        {/* TITLE  */}
        <Skeleton className="h-4 w-2/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        {/* BUTTONS */}
        <Skeleton className="h-4 w-2/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="prose-invert prose-h3:text-xl flex flex-col space-y-2">
        {/* DESCRIPTION */}
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="prose-invert prose-h3:text-xl flex flex-col space-y-2">
        {/* FOR EXAMPLE */}
        <Skeleton className="h-4 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
        {/* FOR EXAMPLE BOX */}
        <Skeleton className="h-36 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
