import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function ExploreCardSkeleton() {
  return (
    <Card className={`group duration-300 hover:bg-card-hovered group-focus:bg-card-hovered`}>
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="h-5 w-1/2 rounded-lg bg-slate-300 dark:bg-slate-700">
            {''}
          </CardTitle>
          <CardDescription className="relative flex h-48 flex-col space-y-4 overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
            <div className="h-3 rounded-lg bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-3 rounded-lg bg-slate-300 dark:bg-slate-700"></div>
            <div className="h-3 w-3/4 rounded-lg bg-slate-300 dark:bg-slate-700"></div>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
