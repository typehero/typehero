import { Button } from '@repo/ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import clsx from 'clsx';

export function Pagination({
  currentPage,
  totalPages,
  onClick,
}: {
  totalPages: number;
  currentPage: number;
  onClick: (page: number) => void;
}) {
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = currentPage - halfVisiblePages;
  let endPage = currentPage + halfVisiblePages;

  if (startPage <= 0) {
    startPage = 1;
    endPage = Math.min(totalPages, maxVisiblePages);
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav className="justify-space-between flex items-center gap-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => onClick(Math.max(0, currentPage - 1))}
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      {pages.map((page) => (
        <Button
          className={clsx('border-border dark:border-ring border', {
            'bg-border dark:bg-neutral-700': page === currentPage,
          })}
          key={`pagination-${page}`}
          onClick={() => onClick(page)}
          variant="ghost"
        >
          {page}
        </Button>
      ))}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onClick(Math.min(totalPages, currentPage + 1))}
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
