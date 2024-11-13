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

export function LeaderboardTable(
  props:
    | {
        data: {
          name: string;
          image: string | null;
          isSupporter: boolean;
          timeToComplete: string;
        }[];
        isDayTable: true;
      }
    | {
        data: {
          name: string;
          image: string | null;
          totalPoints: string;
          isSupporter: boolean;
        }[];
        isDayTable: false;
      },
) {
  return (
    <Table className="font-mono">
      <TableCaption>Leader board for 2023</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%] text-center text-lg uppercase">Rank</TableHead>
          <TableHead className="w-[60%] text-center text-lg uppercase">Username</TableHead>
          <TableHead className="w-[20%] text-center text-lg uppercase">
            {props.isDayTable ? 'Time to Complete' : 'Points'}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.slice(4).map((d, i) => (
          <TableRow key={i}>
            <TableCell className="text-center text-xl">{i + 4}</TableCell>
            <TableCell className="flex flex-row justify-center space-x-4 text-center text-xl">
              <span>{d.name}</span>
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
            {props.isDayTable ? (
              <TableCell className="text-center text-xl">{props.data[i]?.timeToComplete}</TableCell>
            ) : (
              <TableCell className="text-center text-xl">{props.data[i]?.totalPoints}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
