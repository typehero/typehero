import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { Maximize2, Minimize2 } from '@repo/ui/icons';
import { useEffect } from 'react';
import { create } from 'zustand';

export const FS_SETTINGS = {
  isFullscreen: false,
};

type FSSettings = typeof FS_SETTINGS;

interface FSState {
  fssettings: FSSettings;
  updateFSSettings: (settings: Partial<FSSettings>) => void;
}

export const useFullscreenSettingsStore = create<FSState>()((set, get) => ({
  fssettings: FS_SETTINGS,
  updateFSSettings: (fssettings) => set({ fssettings: { ...get().fssettings, ...fssettings } }),
}));

export function FullscreenButton() {
  const { fssettings, updateFSSettings } = useFullscreenSettingsStore();

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    updateFSSettings({ ...fssettings, isFullscreen: !fssettings.isFullscreen });
  };

  useEffect(() => {
    const fullscreenchanged = () => {
      if (!document.fullscreenElement) {
        updateFSSettings({ ...fssettings, isFullscreen: false });
      }
    };
    document.addEventListener('fullscreenchange', fullscreenchanged);
    return () => document.removeEventListener('fullscreenchange', fullscreenchanged);
  }, [fssettings, updateFSSettings]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="focus:outline-none focus-visible:ring-2"
          onClick={handleToggleFullscreen}
        >
          {fssettings.isFullscreen ? (
            <Minimize2 className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          ) : (
            <Maximize2 className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Maximize Editor</p>
      </TooltipContent>
    </Tooltip>
  );
}
