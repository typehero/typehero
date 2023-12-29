'use client';
import { createContext, useState, useContext, type PropsWithChildren } from 'react';
import type { ChallengesByTagOrDifficulty } from '~/app/[locale]/explore/_components/explore.action';

interface TrackContextType {
  getTrack: ChallengesByTagOrDifficulty | null;
  setTrack: React.Dispatch<React.SetStateAction<ChallengesByTagOrDifficulty | null>>;
}

export const TrackContext = createContext<TrackContextType>({ getTrack: null, setTrack: () => {} });

export const TrackProvider = ({ children }: PropsWithChildren) => {
  const [getTrack, setTrack] = useState<ChallengesByTagOrDifficulty | null>(null);

  return <TrackContext.Provider value={{ getTrack, setTrack }}>{children}</TrackContext.Provider>;
};

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('use useTrackContext hook within TrackContextProvider');
  }
  return context;
};

export interface SortKeyType {
  label: 'Beginner' | 'Easy' | 'Extreme' | 'Hard' | 'Medium' | 'Popular';
  value: 'beginner' | 'easy' | 'extreme' | 'hard' | 'medium' | 'popular';
}

export const SORT_KEYS = [
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Beginner',
    value: 'beginner',
  },
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
  {
    label: 'Extreme',
    value: 'extreme',
  },
] as const;

interface SortingContextType {
  sortKey: SortKeyType;
  setSortKey: React.Dispatch<React.SetStateAction<SortKeyType>>;
}

export const SortingContext = createContext<SortingContextType>({
  sortKey: SORT_KEYS[0],
  setSortKey: () => {},
});

export const SortingProvider = ({ children }: PropsWithChildren) => {
  const [sortKey, setSortKey] = useState<SortKeyType>(SORT_KEYS[0]);

  return (
    <SortingContext.Provider value={{ sortKey, setSortKey }}>{children}</SortingContext.Provider>
  );
};

export const useSortingContext = () => {
  const context = useContext(SortingContext);
  if (context === undefined) {
    throw new Error('use useSortingContext hook within SortingContextProvider');
  }
  return context;
};
