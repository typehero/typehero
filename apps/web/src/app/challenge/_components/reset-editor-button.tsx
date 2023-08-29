import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { RotateCcw } from '@repo/ui/icons';

export function ResetEditorButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="focus:outline-none focus-visible:ring-2">
          <RotateCcw className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Reset Editor</p>
      </TooltipContent>
    </Tooltip>
  );
}
