'use client';
import { createContext, useState, useContext } from 'react';
import type { AllChallenges } from '~/app/explore/_components/explore.action';

interface AllChallengesContextType {
  allChallenges: AllChallenges;
  setAllChallenges: React.Dispatch<React.SetStateAction<AllChallenges>>;
}

export const AllChallengesContext = createContext<AllChallengesContextType>(
  {} as AllChallengesContextType,
);

interface AllChallengesProviderProps {
  children: React.ReactNode;
  AC: AllChallenges;
}
export const AllChallengesProvider = ({ children, AC }: AllChallengesProviderProps) => {
  const [allChallenges, setAllChallenges] = useState<AllChallenges>(AC);

  return (
    <AllChallengesContext.Provider value={{ allChallenges, setAllChallenges }}>
      {children}
    </AllChallengesContext.Provider>
  );
};

export const useAllChallengesContext = () => {
  const context = useContext(AllChallengesContext);
  if (context === undefined) {
    throw new Error('use useAllChallengesContext hook within AllChallengesContextProvider');
  }
  return context;
};
