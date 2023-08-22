'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';
import {
  getInfiniteReports,
  type InfiniteReports,
} from '../report/[id]/_components/report/report.action';

export interface ReportsProps {
  initialReports: InfiniteReports;
}

export default function Reports2({ initialReports }: ReportsProps) {
  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [enableInfinite, setEnableInfinite] = React.useState(false);

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['reports'],
    async ({ pageParam }) => {
      const data = await getInfiniteReports(pageParam);
      return data;
    },
    {
      suspense: true,
      getNextPageParam: (
        a,

        b,
      ) => (a.metadata.hasNextPage ? a.metadata.lastCursor : false),
      initialData: {
        pages: [initialReports],
        pageParams: [null],
      },
      enabled: enableInfinite,
    },
  );

  React.useEffect(() => {
    setEnableInfinite(true);
  }, []);

  return (
    <section className="data-table">
      <header className="flex justify-end">
        <Pagination
          onChange={(e) => {
            if (!e.detail.pageLoaded) fetchNextPage().then(() => setPage(e.detail.page - 1));
            else setPage(e.detail.page - 1);
          }}
          totalPages={data?.pages.length}
          hasNextPage={hasNextPage}
          currentPage={0 + 1}
        />
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Info</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Updated at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages[page]?.data.map((tr) => (
            <TableRow key={`report-${tr.id}`} onClick={() => router.push(`/admin/report/${tr.id}`)}>
              <TableCell>{tr.type}</TableCell>
              <TableCell>{tr.reporter.name}</TableCell>
              <TableCell>{tr.status}</TableCell>
              <TableCell>{tr.text.slice(0, 100)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {tr.issues.map((i) => (
                    <div key={`issues-${i.id}`} className="rounded-full bg-zinc-800 px-3 py-1">
                      {i.type}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {tr.createdAt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
              </TableCell>
              <TableCell>
                {tr.updatedAt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
