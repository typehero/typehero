'use client';

import Link from 'next/link';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { Description } from '~/components/challenge/description';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import Comments from './comments';
import { Solutions } from './solutions';
import { Submissions } from './submissions';

interface Props {
  challenge: ChallengeRouteData;
  selectedTab: 'description' | 'submissions' | 'solutions' | 'comments';
}

export function LeftPanel({ challenge, selectedTab }: Props) {
  return (
    <Tabs
      defaultValue={selectedTab}
      className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
    >
      <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-3 rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
        <TabsTrigger
          value="description"
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
        >
          <Link href={`/challenge/${challenge.id}`}>Description</Link>
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
        >
          <Link href={`/challenge/${challenge.id}/solutions`}>Solutions</Link>
        </TabsTrigger>
        <TabsTrigger
          value="submissions"
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
        >
          <Link href={`/challenge/${challenge.id}/submissions`}>Submissions</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-0 flex-1">
        <div className="relative flex h-full flex-col justify-between">
          <div className="px-4 py-3">
            <Description challenge={challenge}></Description>
          </div>

          <div
            className="sticky bottom-0 overflow-hidden rounded-xl border border-zinc-300 border-b-background bg-background/90 backdrop-blur-sm duration-300 dark:border-zinc-700 dark:border-b-muted dark:bg-muted/90"
            style={{
              marginLeft: '-1px',
              marginRight: '-1px',
              boxShadow: '0px 0px 3rem -0.25rem #0004',
            }}
          >
            <Comments challenge={challenge} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="solutions" className="mt-0 flex-1">
        <Solutions challenge={challenge} />
      </TabsContent>
      <TabsContent value="submissions" className="mt-0 flex-1">
        <Submissions challenge={challenge} />
      </TabsContent>
    </Tabs>
  );
}
