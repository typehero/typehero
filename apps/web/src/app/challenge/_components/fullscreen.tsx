import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { Maximize2 } from '@repo/ui/icons';
import { useLayoutSettingsStore } from './challenge-layout';

export function FullscreenButton() {
  const { settings, updateSettings } = useLayoutSettingsStore();

  const handleToggleFullscreen = () => {
    updateSettings({ ...settings, isFullscreen: !settings.isFullscreen });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="focus:outline-none focus-visible:ring-2"
          onClick={handleToggleFullscreen}
        >
          <Maximize2 className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Maximize Editor</p>
      </TooltipContent>
    </Tooltip>
  );
}
