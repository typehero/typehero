import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';

export function DescriptionPanelSkeleton() {
  return (
    <Tabs className="w-full" defaultValue="description">
      <TabsList className="sticky top-0 grid h-auto w-full grid-cols-3 rounded-none border-zinc-300 border-b bg-background dark:border-zinc-700 dark:bg-muted">
        <TabsTrigger
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          value="description"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          value="solutions"
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          value="submissions"
        >
          Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-0 dark:bg-muted" value="description">
        <div className="h-full p-5">
          <div className="mb-2 h-8 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700"> </div>
          <div className="mb-6 flex items-center gap-6 py-4">
            <div className="h-6 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="flex flex-col space-y-10">
            <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent className="flex h-full flex-col space-y-2 p-5" value="solutions">
        <div className="flex flex-col space-y-10">
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
        </div>
      </TabsContent>
      <TabsContent className="flex h-full flex-col space-y-2 p-5" value="submissions">
        <div className="flex flex-col space-y-10">
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="prose-invert flex flex-col space-y-2 prose-h3:text-xl">
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            <div className="h-4 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
