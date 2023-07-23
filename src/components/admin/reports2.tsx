'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getInfiniteReports, type ReportsData } from '../report/report.action';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import Pagination from '../ui/pagination';

export interface Reports2Props {
  reports: ReportsData;
}

export default function Reports2({ reports }: Reports2Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data, hasNextPage, hasPreviousPage, fetchNextPage, fetchPreviousPage } = useInfiniteQuery(
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
      ) => (a?.metadata.hasNextPage ? a?.metadata?.lastCursor : false),
    },
  );

  const allPages = useMemo(() => {
    if (data && data.pages) return data?.pages.length;
    return 0;
  }, [data]);

  return (
    <section className="data-table">
      <header className="flex justify-end">
        <Pagination
          onChange={(e) => {
            fetchNextPage().then(() => setPage(e.detail.page - 1));
          }}
          totalPages={data?.pages.length}
          hasNextPage={hasNextPage}
          currentPage={page + 1}
        />
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages?.[page]?.data.map((tr) => (
            <TableRow key={`report-${tr.id}`} onClick={() => router.push(`/admin/report/${tr.id}`)}>
              <TableCell>{tr.type}</TableCell>
              <TableCell>{tr.reporter.name}</TableCell>
              <TableCell>{tr.status}</TableCell>
              <TableCell>{tr.text.slice(0, 100)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
