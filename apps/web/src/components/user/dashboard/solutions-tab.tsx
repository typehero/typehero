import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { UserData } from '.';
import Link from 'next/link';

export function SolutionsTab({ submissions = [] }: { submissions: UserData['submission'] }) {
  return (
    <Table>
      <TableCaption>A list of your recent challenges.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Challenge</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${submission.challenge.id}`}>
                {submission.challenge.name}
              </Link>
            </TableCell>
            <TableCell>{submission.isSuccessful ? 'Accepted' : 'Rejected'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
