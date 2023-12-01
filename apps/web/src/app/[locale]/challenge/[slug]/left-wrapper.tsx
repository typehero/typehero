'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, type ReactNode, useRef, useState, useEffect, useContext } from 'react';

import { FeatureFlagContext } from '~/app/feature-flag-provider';
import { ChallengeTrackNavigation } from '~/app/[locale]/challenge/_components/challenge-track-navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { cn } from '@repo/ui/cn';
import { FlaskConical, History, Text } from '@repo/ui/icons';

import type { ChallengeRouteData } from './getChallengeRouteData';
import { useTrackNavigationVisiblity } from './use-track-visibility.hook';
import { AOT_CHALLENGES } from './aot-slugs';

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
  const isTrackVisible =
    isTrackFeatureEnabled &&
    hasEnrolledTrackForChallenge &&
    (!isCollapsed || isDesktop) &&
    !isAotChallenge;

  const isIconOnly = isCollapsed && isDesktop;
  const { setIsTrackTitleVisible } = useTrackNavigationVisiblity();

  useEffect(() => {
    setIsTrackTitleVisible(Boolean(isTrackVisible));
  }, [isTrackVisible, setIsTrackTitleVisible]);

  return (
    <div className="flex h-full w-full flex-col">
      {Boolean(isTrackVisible) && (
        <ChallengeTrackNavigation
          challenge={challenge}
          track={track}
          isCollapsed={isCollapsed}
          className={cn('border-b border-zinc-300 p-1 dark:border-zinc-700')}
        />
      )}
      <Tabs
        ref={tabsRef}
        className="flex h-full w-full flex-col overflow-hidden"
        value={selectedTab}
      >
        <TabsList
          className={cn(
            'bg-background/90 dark:bg-muted/90 sticky top-0 z-10 grid h-auto w-full border-b border-zinc-300 backdrop-blur-sm dark:border-zinc-700',
            {
              'grid-rows-3 gap-2': isIconOnly,
              'grid-cols-3 gap-0.5': !isIconOnly,
              'rounded-tl-xl': !isTrackVisible,
              'grid-cols-2 gap-0.5': isAotChallenge && !isIconOnly,
              'grid-rows-2 gap-2': isAotChallenge && isIconOnly,
            },
          )}
          ref={tabsListRef}
        >
          <TabsTrigger
            className={cn(
              'rounded-md duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
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
          {!isAotChallenge ? (
            <TabsTrigger
              className={cn(
                'rounded-md duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
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
          ) : null}
          <TabsTrigger
            className={cn(
              'rounded-md rounded-tr-lg duration-300 hover:bg-neutral-200/50 data-[state=active]:bg-neutral-200 dark:hover:bg-neutral-700/50 dark:data-[state=active]:bg-neutral-700',
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
