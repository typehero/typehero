import { RoleTypes, type Role } from '@repo/db/types';
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
import { UserBadge } from '~/app/events/[year]/[day]/_components/comments/enhanced-user-badge';

export function LeaderboardTable(props: {
  data: {
    name: string;
    roles: Role[];
    bio: string;
    image: string | null;
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
              <UserBadge
                className="underline-offset-4 group-hover:underline"
                user={{
                  ...d,
                  image: d.image ?? '',
                }}
              />
              {d.roles.find((r) => r.role === RoleTypes.SUPPORTER) !== undefined ? (
                <Link href="/support" className="focus:outline-none focus-visible:ring-0">
                  <Badge
                    className="-ml-2 border-none bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold dark:from-yellow-200 dark:to-yellow-500"
                    size="xs"
                    variant="outline"
                  >
                    <span className="text-card">Supporter</span>
                  </Badge>
                </Link>
              ) : null}
            </TableCell>
            <TableCell className="text-center">{d.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
