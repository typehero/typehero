import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface Props {
  setView: (view: 'editor' | 'list') => void;
}

const SubmitSolution = ({ setView }: Props) => {
  return (
    <Button
      className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
      onClick={() => setView('editor')}
    >
      <Plus className="mr-2 h-4 w-4" /> Solution
    </Button>
  );
};

export default SubmitSolution;
