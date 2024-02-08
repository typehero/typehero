'use client';
import { createContext, useState, useContext } from 'react';
import type {
  AllChallenges,
  ChallengesByTagOrDifficulty,
} from '~/app/[locale]/explore/_components/explore.action';
import {
  getChallengesAndTitle,
  type ChallengeType,
  type ChallengeTitles,
  type SortKeyType,
} from './get-challenges-and-title';
import { useLocalStorage } from '~/utils/useLocalStorage';

interface ProblemExplorerContextType {
  sortKey: SortKeyType;
  setSortKey: React.Dispatch<React.SetStateAction<SortKeyType>>;
  title: ChallengeTitles;
  setTitle: React.Dispatch<React.SetStateAction<ChallengeTitles>>;
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
  AC: AllChallenges;
}
export const ProblemExplorerProvider = ({
  children,
  AC,
  isDisabled,
}: ProblemExplorerProviderProps) => {
  const [trackStorage] = useLocalStorage('trackName', 'popular');
  const trackName = trackStorage as ChallengeType;
  const { challenges, title: currentTitle, key } = getChallengesAndTitle(trackName, AC);
  const [getTrack, setTrack] = useState<ChallengesByTagOrDifficulty>(challenges);
  const [title, setTitle] = useState<ChallengeTitles>(currentTitle);
  const [sortKey, setSortKey] = useState<SortKeyType>(key);
  const [isExplorerDisabled, setIsExplorerDisabled] = useState<boolean>(isDisabled);

  return (
    <ProblemExplorerContext.Provider
      value={{
        sortKey,
        setSortKey,
        title,
        setTitle,
        getTrack,
        setTrack,
        isExplorerDisabled,
        setIsExplorerDisabled,
      }}
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
