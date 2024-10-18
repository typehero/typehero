import { Skeleton } from '@repo/ui/components/skeleton';

const SKELETONS = Array.from({ length: 3 }, (_, i) => i + 1);
export function CommentSkeleton() {
  return (
    <>
      {SKELETONS.map((id) => (
        <div key={id} className="space-y-2 px-4 py-2">
          <div className="flex justify-between ">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <Skeleton className="h-5 w-20 bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div>
              <Skeleton className="h-5 w-16 bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>
          <Skeleton className=" h-16 w-full bg-zinc-300 px-3 dark:bg-zinc-700" />
        </div>
      ))}
    </>
  );
}
