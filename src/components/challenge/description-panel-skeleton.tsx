import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function DescriptionPanelSkeleton() {
  return (
    <>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="sticky top-0 grid h-auto w-full grid-cols-3 rounded-none border-b border-zinc-300 bg-background dark:border-zinc-700 dark:bg-muted">
          <TabsTrigger
            value="description"
            className="rounded-md rounded-tl-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="solutions"
            className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          >
            Solutions
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          >
            Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0 dark:bg-muted">
          <div className="h-full p-5">
            <div className="mb-2 h-8 w-1/2 rounded-lg bg-zinc-300 dark:bg-zinc-700"> </div>
            <div className="mb-6 flex items-center gap-6 py-4">
              <div className="h-6 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="h-6 w-4 rounded-lg bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
            <div className="flex flex-col space-y-10">
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
          </div>
        </TabsContent>
        <TabsContent className="flex h-full flex-col space-y-2 p-5" value="solutions">
          <div className="flex flex-col space-y-10">
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
        </TabsContent>
        <TabsContent className="flex h-full flex-col space-y-2 p-5" value="submissions">
          <div className="flex flex-col space-y-10">
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
        </TabsContent>
        2
      </Tabs>
    </>
  );
}
