import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function DescriptionPanelSkeleton() {
  return (
    <div className="flex-1 animate-pulse overflow-y-auto rounded-md bg-white dark:bg-zinc-800">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description" className="hover:bg-zinc-200 dark:hover:bg-zinc-700">
            Description
          </TabsTrigger>
          <TabsTrigger value="solutions" className="hover:bg-zinc-200 dark:hover:bg-zinc-700">
            Solutions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="h-full p-5">
            <div className="mb-2 h-6 w-1/2 rounded-lg dark:bg-slate-700 bg-slate-300"> </div>
            <div className="mb-6 flex items-center gap-6 py-4">
              <div className="h-5 w-10 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-5 w-10 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-5 w-10 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-5 w-10 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
            </div>
            <div className="prose-invert prose-h3:text-xl flex flex-col space-y-2">
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
              <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex h-full flex-col space-y-2 p-5" value="solutions">
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
          <div className="h-3 rounded-lg dark:bg-slate-700 bg-slate-300"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
