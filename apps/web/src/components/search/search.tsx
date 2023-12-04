'use client';

import * as React from 'react';

import { cn } from '@repo/ui/cn';
import { SearchIcon, Loader2 as LoaderIcon } from '@repo/ui/icons';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { Text } from '@repo/ui/components/typography/typography';
import { ScrollArea, ScrollBar } from '@repo/ui/components/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import Link from 'next/link';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import { Markdown } from '@repo/ui/components/markdown';
import type { Challenge } from '@repo/db/types';
import { SearchBoxContextProvider, useSearchBox } from './searchbox.context';
import { SearchProvider, useSearchResult, useSearchStatus } from './search-provider';

export function Search() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'text-muted-foreground group relative w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64',
          )}
          onClick={() => setOpen(true)}
        >
          <span className="hidden lg:inline-flex">Search...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="bg-muted dark:group-hover:bg-muted-foreground top-50% pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <SearchProvider>
        <SearchBoxContextProvider>
          <DialogContent
            className="max-w-full overflow-y-auto md:max-w-[800px] lg:max-w-[800px]"
            displayX={false}
          >
            <SearchBox />
            <Separator />
            <ScrollArea className="h-[500px] md:h-[350px]">
              <Hits onClick={() => setOpen(false)} />
              <ScrollBar className="z-30" />
            </ScrollArea>
          </DialogContent>
        </SearchBoxContextProvider>
      </SearchProvider>
    </Dialog>
  );
}

type OnClick = () => void;

interface HitsProps {
  onClick: OnClick;
}

function Hits({ onClick }: HitsProps) {
  const { query, results } = useSearchResult();
  const keys = Object.keys(results) as Challenge['difficulty'][];

  if (keys.length === 0) {
    return (
      <div className="flex h-full flex-grow flex-col justify-between">
        <Text intent="leading" className="my-8 flex items-center justify-center">
          No results found for "<strong>{query}</strong>"
        </Text>
        <ProposedPhrases />
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-4 p-3">
      {keys.map((difficulty) => {
        const difficultyResult = results[difficulty];

        return (
          <div key={difficulty} className="flex flex-col items-start gap-4">
            <div className="bg-background sticky top-0 z-20 w-full pb-1.5 pt-1">
              <DifficultyBadge difficulty={difficulty} />
            </div>
            <div className="flex w-full flex-col gap-2">
              {difficultyResult.map((result) => (
                <Hit key={result.id} hit={result} onClick={onClick} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Hit({ hit, onClick }: { hit: Challenge; onClick: OnClick }) {
  if (hit.status !== 'ACTIVE') return null;

  return (
    <Link
      onClick={onClick}
      href={`/challenge/${hit.slug}`}
      className="focus-visible:ring-ring hover:bg-foreground/20 bg-foreground/10 flex w-full flex-col items-start gap-2 overflow-hidden rounded-md px-2.5 py-2 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Text intent="h2">{hit.name}</Text>
      </div>
      <div className="prose-invert text-muted-foreground relative text-sm leading-[1.425rem]">
        <Markdown>{hit.shortDescription}</Markdown>
      </div>
    </Link>
  );
}

function ProposedPhrases() {
  const { setQuery } = useSearchBox();

  const updateQuery = (query: string) => () => {
    setQuery(query);
  };

  return (
    <div className="flex flex-col gap-2">
      Try searching for:
      <button
        onClick={updateQuery('Easy')}
        className="hover:bg-foreground/20 bg-foreground/10 flex w-full flex-col items-start gap-2 overflow-hidden rounded-md px-2.5 py-4 transition-colors"
      >
        Easy
      </button>
      <button
        onClick={updateQuery('Extreme')}
        className="hover:bg-foreground/20 bg-foreground/10 flex w-full flex-col items-start gap-2 overflow-hidden rounded-md px-2.5 py-4 transition-colors"
      >
        Extreme
      </button>
    </div>
  );
}

function SearchBox() {
  const { query, setQuery } = useSearchBox();
  const { status } = useSearchStatus();

  const isLoading = status === 'loading';

  return (
    <div className="relative flex w-full items-center gap-2">
      {isLoading ? (
        <LoaderIcon className="h-6 w-6 animate-spin" />
      ) : (
        <SearchIcon className="h-6 w-6" />
      )}
      <input
        aria-label="Search for a challenge"
        type="search"
        className="focus-visible:ring-ring placeholder:text-muted-foreground flex h-10 w-full flex-grow rounded-md bg-transparent px-2 text-sm outline-none"
        placeholder="Search..."
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
      />
    </div>
  );
}
