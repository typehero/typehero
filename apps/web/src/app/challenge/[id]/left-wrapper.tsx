'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

type Tab = 'description' | 'submissions' | 'solutions';
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
    <Tabs defaultValue={selectedTab} className="flex h-full w-full flex-col overflow-hidden">
      <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-3 rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
        <TabsTrigger
          value="description"
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}`)}
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}/solutions`)}
        >
          Solutions
        </TabsTrigger>
        <TabsTrigger
          value="submissions"
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => router.push(`/challenge/${challengeId}/submissions`)}
        >
          Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent value={selectedTab} className="mt-0 h-[calc(100%_-_41px)]">
        {children}
      </TabsContent>
    </Tabs>
  );
}
