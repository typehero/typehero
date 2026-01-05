'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@repo/ui/cn';
import { ChallengeCard } from './challenge-card';
import { DifficultyTabs } from '~/components/ui/difficulty-tabs';
import { MobileDropdown } from '~/components/ui/mobile-dropdown';
import { ProgressBar } from '~/components/ui/progress-bar';
import { useChallengeData } from '~/hooks/use-challenge-data';
import { DIFFICULTY_BADGE_COLORS } from '~/constants/difficulties';
import type { ChallengeExplorerClientProps } from '~/types/challenge';

export function ChallengeExplorerClient({
  difficulties,
  challengesData,
}: ChallengeExplorerClientProps) {
  const [selectedTab, setSelectedTab] = useState<string>('BEGINNER');
  const [showAllChallenges, setShowAllChallenges] = useState<boolean>(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState<boolean>(false);

  const selectedData = challengesData.find((data) => data.tag === selectedTab);

  // Move hook call before any conditional returns
  const { sortedChallenges, completedChallenges } = useChallengeData(
    selectedData?.challenges ?? [],
  );

  const handleTabClick = (tag: string) => {
    setSelectedTab(tag);
    setShowAllChallenges(false);
    setIsMobileDropdownOpen(false);
  };

  const handleShowAllClick = () => {
    setShowAllChallenges(true);
  };

  const displayedChallenges = showAllChallenges ? sortedChallenges : sortedChallenges.slice(0, 11);

  if (!selectedData) {
    return <div>No data found for selected tab</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Dropdown and Desktop Tabs */}
      <div className="container flex flex-row items-center gap-4 sm:flex-row">
        {/* Mobile Dropdown */}
        <MobileDropdown
          options={difficulties}
          selected={selectedTab}
          onSelect={handleTabClick}
          isOpen={isMobileDropdownOpen}
          onToggle={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
        />

        {/* Desktop Tabs */}
        <DifficultyTabs
          difficulties={difficulties}
          selectedTab={selectedTab}
          onTabChange={handleTabClick}
        />

        {/* Progress Bar - Now stacks vertically on mobile */}
        <ProgressBar completed={completedChallenges.length} total={selectedData.challengesLength} />
      </div>

      {/* Challenge Grid */}
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedChallenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenge/${challenge.slug}`}
              className="group block w-full focus:outline-none"
            >
              <ChallengeCard challenge={challenge} />
            </Link>
          ))}

          {/* See All Challenges Card - Only show if not showing all challenges */}
          {!showAllChallenges && (
            <div className="group block">
              <div
                className="flex h-full cursor-pointer flex-col items-start justify-center gap-3 rounded-3xl border border-2 border-[rgba(31,36,47,1)] p-6 text-center transition-colors"
                onClick={handleShowAllClick}
              >
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Looking for something else?
                </p>
                <div className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                  See all {selectedTab.toLowerCase()} challenges
                </div>
                <div className="text-center text-start text-sm  text-neutral-500 dark:text-neutral-500">
                  Click see more challenges and get your knowledge tested with{' '}
                  {selectedData.challengesLength} new challenges!
                </div>
                <div
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
                    DIFFICULTY_BADGE_COLORS[selectedTab as keyof typeof DIFFICULTY_BADGE_COLORS],
                    'hover:opacity-80',
                  )}
                >
                  See {selectedData.label} Challenges →
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
