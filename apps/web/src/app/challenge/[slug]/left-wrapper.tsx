'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ChallengeTrackNavigation } from '~/app/challenge/_components/challenge-track-navigation';
import { FeatureFlagContext } from '~/app/feature-flag-provider';

import { cn } from '@repo/ui/cn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { FlaskConical, History, Text } from '@repo/ui/icons';

import { ProblemExplorerTrackNav } from '~/components/Navigation/problem-explorer-track-nav';
import { AOT_CHALLENGES } from './aot-slugs';
import type { ChallengeRouteData } from './getChallengeRouteData';
import { useTrackNavigationVisiblity } from './use-track-visibility.hook';

type Tab = 'description' | 'solutions' | 'submissions';
interface Props {
  children: ReactNode;
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  expandPanel: () => void;
  isDesktop: boolean;
}

export function LeftWrapper({ children, challenge, track, expandPanel, isDesktop }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const featureFlags = useContext(FeatureFlagContext);

  const isAotChallenge = useMemo(() => AOT_CHALLENGES.includes(challenge.slug), [challenge.slug]);
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

  // Hide the enrolled track when in collapsed mobile view.
  const isTrackFeatureEnabled = featureFlags?.enableInChallengeTrack;
  const hasEnrolledTrackForChallenge = track !== null;
  const isTrackVisible = isTrackFeatureEnabled && (!isCollapsed || isDesktop) && !isAotChallenge;

  const isIconOnly = isCollapsed && isDesktop;
  const { setIsTrackTitleVisible } = useTrackNavigationVisiblity();

  useEffect(() => {
    setIsTrackTitleVisible(Boolean(isTrackVisible));
  }, [isTrackVisible, setIsTrackTitleVisible]);

  return (
    <div className="flex h-full w-full flex-col">
      {Boolean(isTrackVisible && hasEnrolledTrackForChallenge) && (
        <ChallengeTrackNavigation
          challenge={challenge}
          track={track}
          isCollapsed={isCollapsed}
          className={cn('border-zinc-300 border-b p-1 dark:border-zinc-700')}
        />
      )}
      {Boolean(isTrackVisible && !hasEnrolledTrackForChallenge) && (
        <ProblemExplorerTrackNav
          isCollapsed={isCollapsed}
          className={cn('border-zinc-300 border-b p-1 dark:border-zinc-700')}
        />
      )}
      <Tabs
        ref={tabsRef}
        className="flex h-full w-full flex-col overflow-hidden"
        value={selectedTab}
      >
        <TabsList
          className={cn(
            'sticky top-0 grid h-auto w-full border-zinc-300 border-b bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90',
            {
              'grid-rows-3 gap-2': isIconOnly,
              'grid-cols-3 gap-0.5': !isIconOnly,
              'rounded-tl-xl': !isTrackVisible,
            },
          )}
          ref={tabsListRef}
        >
          <TabsTrigger
            className={cn(
              'rounded-md duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 dark:hover:bg-neutral-700/50',
              {
                'p-4': isIconOnly,
                'rounded-tl-xl': !isTrackVisible,
                'rounded-bl-xl': isCollapsed && !isDesktop,
              },
            )}
            onClick={() => {
              router.push(`/challenge/${challenge.slug}`);
              isCollapsed && expandPanel();
            }}
            onFocus={(e) => {
              e.target.click();
            }}
            value="description"
          >
            {isIconOnly ? <Text className="h-4 w-4" /> : 'Description'}
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              'rounded-md duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 dark:hover:bg-neutral-700/50',
              { 'p-4': isIconOnly },
            )}
            onClick={() => {
              router.push(`/challenge/${challenge.slug}/solutions`);
              isCollapsed && expandPanel();
            }}
            onFocus={(e) => {
              e.target.click();
            }}
            value="solutions"
          >
            {isIconOnly ? <FlaskConical className="h-4 w-4" /> : 'Solutions'}
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              'rounded-md rounded-tr-lg duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 dark:hover:bg-neutral-700/50',
              {
                'p-4': isIconOnly,
                'rounded-tr-xl': !isTrackVisible,
                'rounded-br-xl': isCollapsed && !isDesktop,
              },
            )}
            onClick={() => {
              router.push(`/challenge/${challenge.slug}/submissions`);
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
