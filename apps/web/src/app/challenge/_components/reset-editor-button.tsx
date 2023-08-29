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
} from '@repo/ui';
import { RotateCcw } from '@repo/ui/icons';

const ResetEditorButton = () => {
  const { dispatch } = useResetEditor();
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <RotateCcw className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
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
