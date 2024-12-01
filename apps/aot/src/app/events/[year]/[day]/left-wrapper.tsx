'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { cn } from '@repo/ui/cn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { FlaskConical, History, Text } from '@repo/ui/icons';
import { isAfterJanuaryFirst } from '~/utils/time-utils';

type Tab = 'description' | 'solutions' | 'submissions';
interface Props {
  children: ReactNode;
  expandPanel: () => void;
  isDesktop: boolean;
}

export function LeftWrapper({ children, expandPanel, isDesktop }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { year, day } = useParams();
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

  const isIconOnly = isCollapsed && isDesktop;
  const shouldDisplaySolutionsAndComments = isAfterJanuaryFirst(Number(year));

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs
        ref={tabsRef}
        className="flex h-full w-full flex-col overflow-hidden"
        value={selectedTab}
      >
        <TabsList
          className={cn(
            'bg-background/90 dark:bg-muted/90 sticky top-0 grid h-auto w-full border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700',
            {
              'grid-rows-3 gap-2': isIconOnly && shouldDisplaySolutionsAndComments,
              'grid-cols-3 gap-0.5': !isIconOnly && shouldDisplaySolutionsAndComments,
              'grid-rows-2 gap-2': isIconOnly && !shouldDisplaySolutionsAndComments,
              'grid-cols-2 gap-0.5': !isIconOnly && !shouldDisplaySolutionsAndComments,
            },
          )}
          ref={tabsListRef}
        >
          <TabsTrigger
            className={cn(
              'rounded-md rounded-tl-xl duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
              {
                'p-4': isIconOnly,
                'rounded-bl-xl': isCollapsed && !isDesktop,
              },
            )}
            onClick={() => {
              router.push(`/events/${year}/${day}`);
              isCollapsed && expandPanel();
            }}
            onFocus={(e) => {
              e.target.click();
            }}
            value="description"
          >
            {isIconOnly ? <Text className="h-4 w-4" /> : 'Description'}
          </TabsTrigger>
          {shouldDisplaySolutionsAndComments ? (
            <TabsTrigger
              className={cn(
                'rounded-md duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
                { 'p-4': isIconOnly },
              )}
              onClick={() => {
                router.push(`/events/${year}/${day}/solutions`);
                isCollapsed && expandPanel();
              }}
              onFocus={(e) => {
                e.target.click();
              }}
              value="solutions"
            >
              {isIconOnly ? <FlaskConical className="h-4 w-4" /> : 'Solutions'}
            </TabsTrigger>
          ) : null}
          <TabsTrigger
            className={cn(
              'rounded-md rounded-tr-xl duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
              {
                'p-4': isIconOnly,
                'rounded-br-xl': isCollapsed && !isDesktop,
              },
            )}
            onClick={() => {
              router.push(`/events/${year}/${day}/submissions`);
              isCollapsed && expandPanel();
            }}
            onFocus={(e) => {
              e.target.click();
            }}
            value="submissions"
          >
            {isIconOnly ? <History className="h-4 w-4" /> : 'Submissions'}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="mt-0 h-[calc(100%_-_44px)]"
          value={selectedTab}
          ref={tabsContentRef}
        >
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
}
