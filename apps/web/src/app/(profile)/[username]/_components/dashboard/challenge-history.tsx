import { DataTable } from '@repo/ui/components/data-table';
import type { HistoricalChallenge } from './_actions';
import { columns } from './challenge-history-columns';

interface Props {
  challenges: HistoricalChallenge[];
}

export default function ChallengeHistory({ challenges }: Props) {
  return <DataTable data={challenges} columns={columns} />;
}
