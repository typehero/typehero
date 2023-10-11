'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { FlaskConical, History, Text } from '@repo/ui/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, type ReactNode, useRef, useState, useEffect } from 'react';

type Tab = 'description' | 'solutions' | 'submissions';
interface Props {
  children: ReactNode;
  challengeId: number;
  expandPanel: () => void;
  isDesktop: boolean;
}

export function LeftWrapper({ challengeId, children, expandPanel, isDesktop }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isCollapsedRef = useRef(isCollapsed);
  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;
  isCollapsedRef.current = isCollapsed;

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const tabsContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    const tabsContentElement = tabsContentRef.current;
    const tabsListElement = tabsListRef.current;

    if (!tabsElement || !tabsContentElement || !tabsListElement) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target !== tabsElement) continue;
        const isDesktopCollapsed = isDesktopRef.current && entry.contentRect.width <= 60;
        const isMobileCollapsed = !isDesktopRef.current && entry.contentRect.height <= 41;

        if (isDesktopCollapsed || isMobileCollapsed) {
          setIsCollapsed(true);
          tabsContentElement.style.display = 'none';
          if (isDesktopRef.current && !isCollapsedRef.current) {
            tabsListElement.style.display = 'none';
          }
        } else {
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

  useEffect(() => {
    const tabsListElement = tabsListRef.current;
    if (tabsListElement) {
      tabsListElement.style.display = '';
    }
  }, [isCollapsed]);

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
    <Tabs
      ref={tabsRef}
      className="flex h-full w-full flex-col overflow-hidden"
      defaultValue={selectedTab}
    >
      <TabsList
        className={`bg-background/90 dark:bg-muted/90 sticky top-0 z-10 grid h-auto w-full rounded-none rounded-tl-2xl rounded-tr-xl border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700 ${
          isCollapsed ? (isDesktop ? 'grid-rows-3 gap-2' : 'grid-cols-3') : 'grid-cols-3'
        }`}
        ref={tabsListRef}
      >
        <TabsTrigger
          className={`rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 ${
            isCollapsed ? (isDesktop ? 'rounded-r-lg py-4' : 'rounded-bl-xl') : ''
          }`}
          onClick={() => {
            router.push(`/challenge/${challengeId}`);
            expandPanel();
          }}
          value="description"
        >
          {isCollapsed && isDesktop ? <Text className="h-4 w-4" /> : 'Description'}
        </TabsTrigger>
        <TabsTrigger
          className={`rounded-md duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 ${
            isCollapsed && isDesktop ? 'py-4' : ''
          }`}
          onClick={() => {
            router.push(`/challenge/${challengeId}/solutions`);
            expandPanel();
          }}
          value="solutions"
        >
          {isCollapsed && isDesktop ? <FlaskConical className="h-4 w-4" /> : 'Solutions'}
        </TabsTrigger>
        <TabsTrigger
          className={`rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 ${
            isCollapsed ? (isDesktop ? 'rounded-md py-4' : 'rounded-br-xl') : ''
          }`}
          onClick={() => {
            router.push(`/challenge/${challengeId}/submissions`);
            expandPanel();
          }}
          value="submissions"
        >
          {isCollapsed && isDesktop ? <History className="h-4 w-4" /> : 'Submissions'}
        </TabsTrigger>
      </TabsList>
      <TabsContent className="mt-0 h-[calc(100%_-_41px)]" value={selectedTab} ref={tabsContentRef}>
        {children}
      </TabsContent>
    </Tabs>
  );
}
