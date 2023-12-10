'use client';

import * as React from 'react';
import { Button } from '@repo/ui/components/button';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import { SearchProvider } from './search-provider';
import { SearchContent } from './search-content';
import { SearchIcon } from '@repo/ui/icons';

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
        <SearchBar setOpen={setOpen} />
      </DialogTrigger>
      <SearchProvider>
        <DialogContent
          className="max-h-[80vh] max-w-full gap-0 overflow-hidden rounded-sm p-0 sm:rounded-sm md:max-w-[75vw] lg:max-w-[60vw] xl:max-h-[60vh]"
          displayX={false}
        >
          <SearchContent onClick={() => setOpen(false)} />
        </DialogContent>
      </SearchProvider>
    </Dialog>
  );
}

function SearchBar({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <>
      {/* Mobile Bar */}
      <button
        aria-label="mobile search icon"
        className="rounded-lg p-2 focus:outline-none focus-visible:ring-2 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {/* Desktop Bar */}
      <Button
        variant="outline"
        className="text-muted-foreground hidden w-64 justify-between gap-3 text-sm lg:inline-flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="sm:hidden">Search</span>
        <span className="hidden w-20 truncate text-left sm:inline-block md:w-full">
          Search Challenges...
        </span>
        <span className="text-xs">⌘K</span>
      </Button>
    </>
  );
}
