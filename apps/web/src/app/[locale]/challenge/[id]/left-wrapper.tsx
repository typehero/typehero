'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';

type Tab = 'description' | 'solutions' | 'submissions';
interface Props {
  children: ReactNode;
  challengeId: number;
}

export function LeftWrapper({ challengeId, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const selectedTab: Tab = useMemo(() => {
    const splitPath = pathname.split('/');

    if (splitPath.includes('submissions')) {
      return 'submissions';
    }
    if (splitPath.includes('solutions')) {
      return 'solutions';
    }

    return 'description';
  }, [pathname]);

  return (
    <Tabs className="flex h-full w-full flex-col overflow-hidden" defaultValue={selectedTab}>
      <TabsList className="bg-background/90 dark:bg-muted/90 sticky top-0 z-10 grid h-auto w-full grid-cols-3 rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700">
        <TabsTrigger
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}`)}
          value="description"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}/solutions`)}
          value="solutions"
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}/submissions`)}
          value="submissions"
        >
          Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-0 h-[calc(100%_-_41px)]" value={selectedTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
}
