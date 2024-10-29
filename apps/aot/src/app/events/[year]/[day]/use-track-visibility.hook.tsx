'use client';
import { createContext, useState, useContext, type PropsWithChildren } from 'react';

interface TrackVisibilityContextType {
  isTrackTitleVisible: boolean;
  setIsTrackTitleVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrackVisibilityContext = createContext({} as TrackVisibilityContextType);

export const TrackVisibiltyProvider = ({ children }: PropsWithChildren) => {
  const [isTrackTitleVisible, setIsTrackTitleVisible] = useState<boolean>(false);

  return (
    <TrackVisibilityContext.Provider value={{ isTrackTitleVisible, setIsTrackTitleVisible }}>
      {children}
    </TrackVisibilityContext.Provider>
  );
};

export const useTrackNavigationVisiblity = () => {
  const context = useContext(TrackVisibilityContext);
  if (context === undefined) {
    throw new Error('use useTrackVisiblity hook within TrackVisibiltyProvider');
  }
  return context;
};
