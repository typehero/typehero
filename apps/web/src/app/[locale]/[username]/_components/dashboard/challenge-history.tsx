import { DataTable } from '@repo/ui/components/data-table';
import { columns } from './challenge-history-columns';

interface Challenge {
  id: number;
  name: string;
  slug: string;
  submission: {
    createdAt: Date;
  }[];
}

interface Props {
  challenges: Challenge[];
}

export default function ChallengeHistory({ challenges }: Props) {
  return <DataTable data={challenges} columns={columns} />;
}
