import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function ExploreCardSkeleton() {
  return (
    <Card className="group duration-300">
      <CardHeader className="relative grid items-start gap-4">
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <CardTitle className="h-10 w-full animate-pulse rounded-lg bg-zinc-300 pb-4 text-3xl text-white dark:bg-zinc-700">
            {' '}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="group-hover:bg-card-hovered relative rounded-xl p-6 duration-300">
        <CardDescription className="relative h-14 max-w-[75%] overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          <Skeleton className="h-6 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </CardDescription>

        <div className="text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Skeleton className="h-6 w-16 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
