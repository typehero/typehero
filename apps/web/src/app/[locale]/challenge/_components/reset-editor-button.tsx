import { useResetEditor } from '@repo/monaco/editor-hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui';
import { RotateCcw } from '@repo/ui/icons';

const ResetEditorButton = () => {
  const { dispatch } = useResetEditor();
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <RotateCcw className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Reset to default code definition</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset code?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => dispatch('resetCode')}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export { ResetEditorButton };
