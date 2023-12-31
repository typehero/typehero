'use client';
import { createContext, useState, useContext, type PropsWithChildren } from 'react';
import type { ChallengesByTagOrDifficulty } from '~/app/[locale]/explore/_components/explore.action';

interface ProblemExplorerContextType {
  isExplorerDisabled: boolean;
  setIsExplorerDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  getTrack: ChallengesByTagOrDifficulty;
  setTrack: React.Dispatch<React.SetStateAction<ChallengesByTagOrDifficulty>>;
}

export const ProblemExplorerContext = createContext<ProblemExplorerContextType>(
  {} as ProblemExplorerContextType,
);

interface ProblemExplorerProviderProps {
  children: React.ReactNode;
  isDisabled: boolean;
  PC: ChallengesByTagOrDifficulty;
}
export const ProblemExplorerProvider = ({
  children,
  PC,
  isDisabled,
}: ProblemExplorerProviderProps) => {
  const [getTrack, setTrack] = useState<ChallengesByTagOrDifficulty>(PC);
  const [isExplorerDisabled, setIsExplorerDisabled] = useState<boolean>(isDisabled);

  return (
    <ProblemExplorerContext.Provider
      value={{ getTrack, setTrack, isExplorerDisabled, setIsExplorerDisabled }}
    >
      {children}
    </ProblemExplorerContext.Provider>
  );
};

export const useProblemExplorerContext = () => {
  const context = useContext(ProblemExplorerContext);
  if (context === undefined) {
    throw new Error('use useProblemExplorerContext hook within ProblemExplorerContextProvider');
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
