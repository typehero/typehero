import type { Role } from '@repo/db/types';
import { Badge } from '@repo/ui/components/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import Link from 'next/link';

export function LeaderboardTable(props: {
  data: {
    name: string;
    roles: Role[];
    bio: string;
    image: string | null;
    isSupporter: boolean;
    score: number | string;
  }[];
  isDayTable: boolean;
}) {
  return (
    <Table className="font-mono">
      <TableCaption>Leaderboard for 2023</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%] text-center uppercase">Rank</TableHead>
          <TableHead className="w-[60%] text-center uppercase">Username</TableHead>
          <TableHead className="w-[20%] text-center uppercase">
            {props.isDayTable ? 'Time' : 'Points'}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.slice(3).map((d, i) => (
          <TableRow key={i} className="group">
            <TableCell className="text-center ">{i + 4}</TableCell>
            <TableCell className="flex flex-row flex-wrap items-center justify-center space-x-4 space-y-1 text-center">
              <Link
                href={`https://typehero.dev/@${d.name}`}
                target="_blank"
                className="underline-offset-4 group-hover:underline"
              >
                {d.name}
              </Link>
              {d.isSupporter ? (
                <Link href="/support" className="focus:outline-none focus-visible:ring-0">
                  <Badge className="-ml-2 font-bold" size="xs" variant="outline">
                    <span className="bg-gradient-to-r  from-emerald-500 to-emerald-600 bg-clip-text font-bold text-transparent dark:from-emerald-200 dark:to-emerald-500">
                      Supporter
                    </span>
                  </Badge>
                </Link>
              ) : null}
            </TableCell>
            <TableCell className="text-center ">{d.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
