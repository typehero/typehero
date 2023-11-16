import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';

export function EnrolledTrackCardSkeleton() {
  return (
    <div className="relative mb-16 mt-8 flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
      <Card className="group w-[250px] flex-none snap-center focus:outline-none sm:w-[330px] xl:w-[333px]">
        <CardHeader className="relative flex flex-col items-start gap-1 pb-0">
          <CardTitle className="h-10 w-full animate-pulse rounded-lg bg-zinc-300 pb-4 text-3xl text-white dark:bg-zinc-700">
            <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </CardTitle>
        </CardHeader>
        <CardContent className="group-hover:bg-card-hovered relative rounded-xl p-6 duration-300">
          <CardDescription className="relative h-14 max-w-[75%] overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
            <Skeleton className="h-6 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export function AllTracksCardSkeleton() {
  return (
    <div className="w-[calc(100% + 8rem)] container grid h-72 grid-cols-1 gap-4 sm:px-8 md:-mx-16 md:grid-cols-2 md:px-0 lg:mx-0 lg:w-full xl:grid-cols-3 2xl:gap-8">
      <Card className="group w-[250px] flex-none snap-center focus:outline-none sm:w-[330px] xl:w-[333px]">
        <CardHeader className="relative flex flex-col items-start gap-1 pb-0">
          <CardTitle className="h-10 w-full animate-pulse rounded-lg bg-zinc-300 pb-4 text-3xl text-white dark:bg-zinc-700">
            <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </CardTitle>
        </CardHeader>
        <CardContent className="group-hover:bg-card-hovered relative rounded-xl p-6 duration-300">
          <CardDescription className="relative h-14 max-w-[75%] overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
            <Skeleton className="h-6 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
