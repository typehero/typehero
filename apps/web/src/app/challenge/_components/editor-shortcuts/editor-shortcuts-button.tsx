import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { SquareSlash } from '@repo/ui/icons';
import { EditorShortcuts } from './editor-shortcuts-form';

export function EditorShortcutsButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <SquareSlash className="stroke-1 stroke-zinc-500 hover:stroke-zinc-400" size={20} />
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1">Shortcuts</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
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
