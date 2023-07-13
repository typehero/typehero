export function DescriptionSkeleton() {
  return (
    <div className="flex flex-col space-y-10 px-4 py-3">
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* TITLE  */}
        <div className="h-4 w-3/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        {/* BUTTONS */}
        <div className="h-4 w-3/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* DESCRIPTION */}
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
      <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
        {/* FOR EXAMPLE */}
        <div className="h-4 w-1/6 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
        {/* FOR EXAMPLE BOX */}

        <div className="h-36 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
      </div>
    </div>
  );
}
