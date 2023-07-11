export function DescriptionSkeleton() {
  return (
    <div className="flex flex-col space-y-10 px-4 py-3">
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
    </div>
  );
}
