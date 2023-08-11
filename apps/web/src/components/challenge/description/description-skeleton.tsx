import { Skeleton } from '~/components/ui/skeleton';

export function DescriptionSkeleton() {
  return (
    <div className="flex flex-col space-y-10 px-4 py-3">
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* TITLE  */}
        <Skeleton className="h-4 w-2/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
        {/* BUTTONS */}
        <Skeleton className="h-4 w-2/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* DESCRIPTION */}
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
        <Skeleton className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* FOR EXAMPLE */}
        <Skeleton className="h-4 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
        {/* FOR EXAMPLE BOX */}
        <Skeleton className="h-36 rounded-lg bg-zinc-300 dark:bg-zinc-700"></Skeleton>
      </div>
    </div>
  );
}
