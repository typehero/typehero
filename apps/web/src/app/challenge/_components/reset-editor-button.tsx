import { useResetEditor } from '@repo/monaco/EditorHooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { RotateCcw } from '@repo/ui/icons';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const ResetEditorButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { dispatch } = useResetEditor();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button ref={ref} {...props} onClick={dispatch}>
            <RotateCcw className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset Editor</p>
        </TooltipContent>
      </Tooltip>
    );
  },
);
ResetEditorButton.displayName = 'ResetEditorButton';

export { ResetEditorButton };
