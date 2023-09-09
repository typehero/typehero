import { Settings } from '@repo/ui/icons';
import { SettingsForm } from './settings-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

export function SettingsButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Settings className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1">Settings</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingsForm />
      </DialogContent>
    </Dialog>
  );
}
