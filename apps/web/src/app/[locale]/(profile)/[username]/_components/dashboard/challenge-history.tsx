import { DataTable } from '@repo/ui/components/data-table';
import { columns } from './challenge-history-columns';
import type { HistoricalChallenge } from './_actions';

interface Props {
  challenges: HistoricalChallenge[];
}

export default function ChallengeHistory({ challenges }: Props) {
  return <DataTable data={challenges} columns={columns} />;
}
