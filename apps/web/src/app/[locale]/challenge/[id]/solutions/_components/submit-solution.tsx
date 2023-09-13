import { Button } from '@repo/ui/components/button';
import { Plus } from '@repo/ui/icons';

interface Props {
  disabled: boolean;
  setView: (view: 'editor' | 'list') => void;
}

export function SubmitSolution({ disabled, setView }: Props) {
  return (
    <Button
      className="h-8 rounded-lg px-3 py-2"
      disabled={disabled}
      onClick={() => setView('editor')}
    >
      <Plus className="mr-2 h-4 w-4" /> Solution
    </Button>
  );
}
