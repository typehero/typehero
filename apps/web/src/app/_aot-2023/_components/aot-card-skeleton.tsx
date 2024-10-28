import { Skeleton } from '@repo/ui/components/skeleton';

export function AOTCardSkeleton() {
  return (
    <div className="container flex flex-col items-center gap-5 pb-8 md:gap-10 md:py-5">
      {/*Title */}
      <Skeleton className="mb-10 h-24 w-4/5 animate-pulse rounded-xl bg-zinc-300 text-center dark:bg-zinc-700" />

      {/*Cards */}
      <div className="w-[calc(100% + 8rem)] grid grid-cols-[repeat(1,240px)] justify-center gap-4 sm:px-8 md:-mx-16 md:grid-cols-[repeat(3,240px)] md:px-0 lg:mx-0 lg:w-full xl:grid-cols-[repeat(4,240px)] 2xl:gap-8">
        {Array.from({ length: 8 }, (_, idx) => (
          <Skeleton
            className="h-[320px] animate-pulse rounded-lg bg-zinc-300  dark:bg-zinc-700"
            key={idx}
          />
        ))}
      </div>
    </div>
  );
}
