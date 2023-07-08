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

export function SolutionsTab({ solutions = [] }: { solutions: UserData['solution'] }) {
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
        {solutions.map((solution) => (
          <TableRow key={solution.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${solution.challenge.id}`}>{solution.challenge.name}</Link>
            </TableCell>
            <TableCell>{solution.isSuccessful ? 'Accepted' : 'Rejected'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
