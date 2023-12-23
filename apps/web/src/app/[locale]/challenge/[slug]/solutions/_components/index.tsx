'use client';

import { Calendar, MessageCircle, ThumbsUp } from '@repo/ui/icons';
import { useSession } from '@repo/auth/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { SolutionEditor } from './solution-editor';
import { NoSolutions } from './nosolutions';
import { SubmitSolution } from './submit-solution';
import { type PaginatedSolution, getPaginatedSolutions } from '../getSolutionRouteData';
import { getRelativeTime } from '~/utils/relativeTime';
import { Badge } from '@repo/ui/components/badge';
import { UserBadge } from '@repo/ui/components/user-badge';
import { useParams } from 'next/navigation';
import { Pagination } from '../../../_components/pagination';
import { useQuery } from '@tanstack/react-query';
import { SolutionsSkeleton } from './solution-skeleton';
import { SortSelect } from '../../../_components/sort-select';
import { useGetQueryString } from './useGetQueryString';
import { useQueryParamState } from './useQueryParamState';

interface Props {
  slug: string;
}

export const SORT_KEYS = [
  {
    label: 'Newest Solutions',
    value: 'newest',
    key: 'createdAt',
    order: 'desc',
  },
  {
    label: 'Most Votes',
    value: 'votes',
    key: 'vote',
    order: 'desc',
  },
  {
    label: 'Most Replies',
    value: 'solutionComment',
    key: 'solutionComment',
    order: 'desc',
  },
] as const;

type View = 'details' | 'editor' | 'list';

export function Solutions({ slug }: Props) {
  const [view, setView] = useState<View>('list');
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = useState<(typeof SORT_KEYS)[number]>(SORT_KEYS[0]);
  const [page, setPage] = useQueryParamState<number>('page', 1);
  const queryKey = ['challenge-solutions', slug, page, sortKey.key, sortKey.order];
  const session = useSession();

  const handleChangePage = (page: number) => {
    setPage(page);
    commentContainerRef.current?.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleValueChange = (value: string) => {
    setSortKey(SORT_KEYS.find((sk) => sk.value === value) ?? SORT_KEYS[0]);
    setPage(1);
  };

  const { status, data: pageData } = useQuery({
    queryKey,
    queryFn: () =>
      getPaginatedSolutions({ slug, page, sortKey: sortKey.key, sortOrder: sortKey.order }),
    staleTime: 60000, // one minute
    refetchOnWindowFocus: false,
  });

  const loggedInUserHasSolution = pageData?.submission?.length ?? 0;

  return (
    <div className="flex h-full flex-col">
      {view === 'editor' && pageData?.id ? (
        <SolutionEditor
          challengeId={pageData.id}
          code={pageData?.submission?.[0]?.code}
          dismiss={() => setView('list')}
        />
      ) : null}

      {view === 'list' && (
        <>
          {pageData?.sharedSolution?.length !== 0 ? (
            <>
              {status === 'pending' && <SolutionsSkeleton />}
              {status === 'success' && (
                <div className="bg-background/70 dark:bg-muted/70 flex w-full justify-end border-b border-zinc-300 p-2 backdrop-blur-sm dark:border-zinc-700">
                  <SubmitSolution disabled={Boolean(!loggedInUserHasSolution)} setView={setView} />
                </div>
              )}
              <div
                className="custom-scrollable-element relative flex h-full flex-col overflow-y-auto"
                ref={commentContainerRef}
              >
                <div>
                  {(pageData?.sharedSolution?.length ?? 0) > 0 && (
                    <SortSelect
                      currentSortKey={sortKey}
                      totalSortKeys={SORT_KEYS}
                      onValueChange={handleValueChange}
                    />
                  )}
                </div>
                <div className="flex-1">
                  {status === 'success' &&
                    pageData?.sharedSolution?.map((solution) => (
                      <SolutionRow key={solution.id} solution={solution} />
                    ))}
                </div>
                {(pageData?.totalPages ?? 0) > 1 && (
                  <div className="mb-2 flex justify-center">
                    <Pagination
                      currentPage={page}
                      onClick={handleChangePage}
                      totalPages={pageData?.totalPages ?? 0}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <NoSolutions
              loggedInUser={Boolean(session.data?.user)}
              loggedInUserHasSolution={loggedInUserHasSolution > 0}
              setView={setView}
            />
          )}
        </>
      )}
    </div>
  );
}

function SolutionRow({
  solution,
}: {
  solution: NonNullable<PaginatedSolution['sharedSolution']>[number];
}) {
  const { slug } = useParams();
  const queryString = useGetQueryString();
  return (
    <Link
      href={`/challenge/${slug}/solutions/${solution.id}?${queryString}`}
      className="flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
    >
      <h3 className="truncate font-bold">{solution.title}</h3>
      <div className="flex items-center gap-2">
        <UserBadge username={solution.user?.name ?? ''} linkComponent={Link} />
        <div className="text-muted-foreground flex flex-1 items-center gap-2">
          <Calendar className=" h-4 w-4" />
          <span className="text-xs">{getRelativeTime(solution.createdAt)}</span>
        </div>
        {solution.isPinned ? (
          <Badge className="dark:bg-difficulty-beginner-dark bg-difficulty-beginner text-white duration-300 dark:text-black">
            Pinned
          </Badge>
        ) : null}
        <Badge variant="secondary" size="xs" className="gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{solution._count.vote}</span>
        </Badge>
        <Badge variant="secondary" size="xs" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{solution._count.solutionComment}</span>
        </Badge>
      </div>
    </Link>
  );
}
