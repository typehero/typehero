import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';

const challengesList = [
  {
    challengeTitle: 'Extreme Challenge 5000',
    challengeStatus: 'N/A',
  },
];

export function BookmarkTab() {
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
