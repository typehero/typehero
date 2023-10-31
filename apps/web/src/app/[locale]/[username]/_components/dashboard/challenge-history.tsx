import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Challenge</TableHead>
          <TableHead>Last Submission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.map((challenge) => (
          <TableRow key={challenge.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${challenge.slug}`}>{challenge.name}</Link>
            </TableCell>
            <TableCell>{getRelativeTime(challenge.submission[0]!.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
