import { ArrowRightLeft } from '@repo/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

interface SwapPanelButtonProps {
  toggleDirection: () => void;
}

const SwapPanelButton = ({ toggleDirection }: SwapPanelButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={toggleDirection} className="hidden lg:block">
          <ArrowRightLeft className="stroke-zinc-500 stroke-1 hover:stroke-zinc-400" size={20} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1">Swap Panels</TooltipContent>
    </Tooltip>
  );
};

export default SwapPanelButton;
