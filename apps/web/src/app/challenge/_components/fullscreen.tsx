import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { Maximize2 } from '@repo/ui/icons';

export function FullscreenButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button>
          <Maximize2 className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Maximize Editor</p>
      </TooltipContent>
    </Tooltip>
  );
}
