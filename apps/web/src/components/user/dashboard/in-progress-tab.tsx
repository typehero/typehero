import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

const challengesList = [
  {
    challengeTitle: 'Extreme Challenge 1',
    challengeStatus: 'In-Progress',
  },
  {
    challengeTitle: 'Extreme Challenge 4',
    challengeStatus: 'In-Progress',
  },
];

export function InProgressTab() {
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
        {challengesList.map((challengeTitle) => (
          <TableRow key={challengeTitle.challengeTitle}>
            <TableCell className="font-medium">{challengeTitle.challengeTitle}</TableCell>
            <TableCell>{challengeTitle.challengeStatus}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
