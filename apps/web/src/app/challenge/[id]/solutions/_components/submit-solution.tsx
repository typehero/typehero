import { Plus } from '@repo/ui/icons';
import { Button } from '@repo/ui';

interface Props {
  disabled: boolean;
  setView: (view: 'editor' | 'list') => void;
}

function SubmitSolution({ disabled, setView }: Props) {
  return (
    <Button
      className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
      disabled={disabled}
      onClick={() => setView('editor')}
    >
      <Plus className="mr-2 h-4 w-4" /> Solution
    </Button>
  );
}

export default SubmitSolution;
