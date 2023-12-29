'use client';
import { createContext, useState, useContext, type PropsWithChildren } from 'react';
import type { GetCurrentChallengeType } from './[locale]/challenge/[slug]/getChallengeRouteData';

interface ChallengeRouteDataContextType {
  currentChallenge: GetCurrentChallengeType | null;
  setCurrentChallenge: React.Dispatch<React.SetStateAction<GetCurrentChallengeType | null>>;
}

export const ChallengeRouteDataContext = createContext({} as ChallengeRouteDataContextType);

export const ChallegeRouteDataProvider = ({ children }: PropsWithChildren) => {
  const [currentChallenge, setCurrentChallenge] = useState<GetCurrentChallengeType | null>(null);

  return (
    <ChallengeRouteDataContext.Provider value={{ currentChallenge, setCurrentChallenge }}>
      {children}
    </ChallengeRouteDataContext.Provider>
  );
};

export const useChallengeRouteData = () => {
  const context = useContext(ChallengeRouteDataContext);
  if (context === undefined) {
    throw new Error('use useChallengeRouteData hook within ChallegeRouteDataProvider');
  }
  return context;
};
