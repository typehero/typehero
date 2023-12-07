'use client';

import * as React from 'react';

import { SearchIcon, Loader2 as LoaderIcon } from '@repo/ui/icons';
import { Button } from '@repo/ui/components/button';
import { Separator } from '@repo/ui/components/separator';
import { Text } from '@repo/ui/components/typography/typography';
import { ScrollArea, ScrollBar } from '@repo/ui/components/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import Link from 'next/link';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import { SearchBoxContextProvider, useSearchBox } from './searchbox.context';
import { SearchProvider, useSearchResult, useSearchStatus, type Result } from './search-provider';
import { Highlight } from 'react-instantsearch';
import { DialogClose } from '@radix-ui/react-dialog';

export function Search() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-muted-foreground w-30 group relative justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
          onClick={() => setOpen(true)}
        >
          <span className="sm:hidden">Search</span>
          <span className="hidden w-20 truncate text-left sm:inline-block md:w-full">
            Search Challenges...
          </span>
          <kbd className="bg-muted dark:group-hover:bg-muted-foreground top-50% pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <SearchProvider>
        <SearchBoxContextProvider>
          <DialogContent
            className="max-h-[80vh] max-w-full overflow-hidden rounded-sm p-0 sm:rounded-sm md:max-w-[75vw] lg:max-w-[65vw]"
            displayX={false}
          >
            <Topbar />
            <Separator />
            <ScrollArea className="h-[60vh]">
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

  if (results.length === 0) {
    return (
      <div className="flex h-full flex-grow flex-col justify-between">
        <Text intent="leading" className="my-8 flex items-center justify-center">
          No results found for "<strong className="max-w-[50%] md:max-w-[400px]">{query}</strong>"
        </Text>
        <ProposedPhrases />
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col">
      {results.map((hit) => (
        <Hit key={hit.id} hit={hit} onClick={onClick} />
      ))}
    </div>
  );
}

function Hit({ hit, onClick }: { hit: Result; onClick: OnClick }) {
  if (hit.status !== 'ACTIVE') return null;

  return (
    <Link
      prefetch={false}
      onClick={onClick}
      href={`/challenge/${hit.slug}`}
      className="focus-visible:ring-ring hover:bg-foreground/10 flex w-full flex-col items-start justify-center gap-2 overflow-hidden border-b p-6 transition-colors"
    >
      <div className="flex items-start gap-2">
        <DifficultyBadge difficulty={hit.difficulty} className="w-[80px] justify-center" />
        <Highlight
          attribute="name"
          hit={hit}
          classNames={{
            root: 'text-sm text-foreground/60',
            highlighted: 'font-medium bg-transparent text-foreground',
          }}
        />
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

function Topbar() {
  const { query, setQuery } = useSearchBox();
  const { status } = useSearchStatus();

  const isLoading = status === 'loading';

  return (
    <div className="relative flex w-full items-center gap-2 p-4 pb-0">
      {isLoading ? (
        <LoaderIcon className="h-6 w-6 animate-spin" />
      ) : (
        <SearchIcon className="h-6 w-6" />
      )}
      <input
        aria-label="Search for a challenge"
        type="search"
        className="focus-visible:ring-ring placeholder:text-muted-foreground flex h-10 w-full flex-grow rounded-md bg-transparent px-2 text-sm outline-none"
        placeholder="Search for a challenge..."
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
      />
      <DialogClose className="hidden md:block">
        <kbd className="bg-muted dark:group-hover:bg-muted-foreground pointer-events-none hidden h-8 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">esc</span>
        </kbd>
      </DialogClose>
    </div>
  );
}
