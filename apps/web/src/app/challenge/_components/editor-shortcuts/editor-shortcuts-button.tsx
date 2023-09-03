import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui';
import { EditorShortcuts } from './editor-shortcuts-form';
import { SquareSlash } from '@repo/ui/icons';

export function EditorShortcutsButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <SquareSlash className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1">Shortcuts</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="w-[200px]">
        <DialogHeader>
          <DialogTitle>Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <EditorShortcuts />
        </div>
      </DialogContent>
    </Dialog>
  );
}
