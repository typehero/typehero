import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

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

export function Pagination({
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
          {i === fuck.length - 1 && hasNextPage ? '+' : null}
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
