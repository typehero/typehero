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
import { Settings } from '@repo/ui/icons';
import { SettingsForm } from './settings-form';

export function SettingsButton() {
  return (
    <Dialog>
      <DialogTrigger tabIndex={-1} className="focus:outline-none focus-visible:ring-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="items-centerdark:bg-zinc-700 group flex focus:outline-none focus-visible:ring-2">
              <Settings
                className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400 focus:outline-none focus-visible:ring-0"
                size={20}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1">Settings</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="w-[200px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <SettingsForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
