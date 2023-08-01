import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from './button';
import clsx from 'clsx';

export interface OnPageChangePayload {
  page: number;
  pageLoaded: boolean;
}

export interface PaginationProps {
  hasNextPage?: boolean;
  totalPages?: number;
  currentPage?: number;
  onChange: (e: CustomEvent<OnPageChangePayload>) => void;
}

export default function Pagination({
  hasNextPage = false,
  totalPages = 1,
  currentPage = 1,
  onChange,
}: PaginationProps) {
  const fuck = useMemo(() => {
    const length = totalPages > 5 ? 5 : totalPages;
    const initial = Array.from({ length }, (_, i) => i + 1);
    if (totalPages > 5) {
      [initial[1], initial[2], initial[3], initial[4]] = [
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages,
      ];
    }
    return initial;
  }, [currentPage, totalPages]);

  return (
    <div className="pagination justify-baseline flex gap-2">
      <div className="prev">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            onChange(
              new CustomEvent('page:change', {
                detail: {
                  page: currentPage - 1,
                  pageLoaded: true,
                },
              }),
            )
          }
        >
          <ChevronLeft />
        </button>
      </div>
      {fuck.map((page, i) => (
        <button key={`pagination-${page}`}>
          {page}
          {i === fuck.length - 1 && hasNextPage && '+'}
        </button>
      ))}
      <div className="next">
        <button
          disabled={!hasNextPage && currentPage === totalPages}
          onClick={() =>
            onChange(
              new CustomEvent('page:change', {
                detail: {
                  page: currentPage + 1,
                  pageLoaded: hasNextPage && currentPage !== totalPages,
                },
              }),
            )
          }
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

interface Props {
  totalPages: number;
  currentPage: number;
  onClick(page: number): void;
}
export function Pagination2({ currentPage, totalPages, onClick }: Props) {
  // we want to show a max of 10 buttons
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="justify-space-between flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onClick(Math.max(0, currentPage - 1))}
      >
        <ChevronLeft />
      </Button>
      {pages.map((page) => (
        <Button
          variant="ghost"
          key={`pagination-${page}`}
          className={clsx({ 'border border-black dark:border-white/30 ': page === currentPage })}
          onClick={() => onClick(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onClick(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
