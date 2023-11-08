import { DataTable } from '@repo/ui/components/data-table';
import { columns, type Challenge } from './challenge-history-columns';

interface Props {
  challenges: Challenge[];
}

export default function ChallengeHistory({ challenges }: Props) {
  return <DataTable data={challenges} columns={columns} />;
}
