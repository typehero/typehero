'use client';
import { createContext, useState, useContext, type PropsWithChildren } from 'react';

interface TrackVisibilityContextType {
  isTrackTitleVisible: boolean | null;
  setIsTrackTitleVisible: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const TrackVisibilityContext = createContext<TrackVisibilityContextType | undefined>(
  undefined,
);

export const TrackVisibiltyProvider = ({ children }: PropsWithChildren) => {
  const [isTrackTitleVisible, setIsTrackTitleVisible] = useState<boolean | null>(null);

  return (
    <TrackVisibilityContext.Provider value={{ isTrackTitleVisible, setIsTrackTitleVisible }}>
      {children}
    </TrackVisibilityContext.Provider>
  );
};

export const useTrackVisiblity = () => {
  const context = useContext(TrackVisibilityContext);
  if (context === undefined) {
    throw new Error('use the context within context provider');
  }
  return context;
};
