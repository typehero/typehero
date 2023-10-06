'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { usePathname, useRouter } from 'next/navigation';
import {
  useMemo,
  type ReactNode,
  useRef,
  useState,
  useLayoutEffect,
  type MutableRefObject,
} from 'react';

type Tab = 'description' | 'solutions' | 'submissions';
interface Props {
  children: ReactNode;
  challengeId: number;
  leftSide: MutableRefObject<HTMLDivElement | null>;
}

export function LeftWrapper({ challengeId, children, leftSide }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabsContentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const tabsElement = tabsRef.current;
    const tabsContentElement = tabsContentRef.current;

    if (!tabsElement || !tabsContentElement) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === tabsElement && entry.contentRect.width < 60) {
          setIsCollapsed(true);
          tabsContentElement.style.display = 'none';
        } else {
          console.log('removing none');
          tabsContentElement.style.display = '';
          setIsCollapsed(false);
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(tabsElement);

    return () => {
      resizeObserver.unobserve(tabsElement);
    };
  }, []);

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

  const expandPanel = () => {
    if (!leftSide.current) return;
    leftSide.current.style.width = '500px';
  };

  console.log('re-rendering');

  return (
    <Tabs
      ref={tabsRef}
      className="flex h-full w-full flex-col overflow-hidden"
      defaultValue={selectedTab}
    >
      <TabsList
        className={`bg-background/90 dark:bg-muted/90 sticky top-0 z-10 grid h-auto w-full rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700 ${
          isCollapsed ? 'grid-rows-3 gap-6' : 'grid-cols-3'
        }`}
      >
        {isCollapsed && (
          <button
            className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            onClick={() => expandPanel()}
          >
            {'>'}
          </button>
        )}
        <TabsTrigger
          className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => {
            router.push(`/challenge/${challengeId}`);
            expandPanel();
          }}
          value="description"
        >
          {isCollapsed ? 'X' : 'Description'}
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => {
            router.push(`/challenge/${challengeId}/solutions`);
            expandPanel();
          }}
          value="solutions"
        >
          {isCollapsed ? 'Y' : 'Solutions'}
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
          onClick={() => {
            router.push(`/challenge/${challengeId}/submissions`);
            expandPanel();
          }}
          value="submissions"
        >
          {isCollapsed ? 'Z' : 'Submissions'}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className={`mt-0 h-[calc(100%_-_41px)]`} //${isCollapsed ? 'hidden' : ''}
        value={selectedTab}
        ref={tabsContentRef}
      >
        {children}
      </TabsContent>
    </Tabs>
  );
}
