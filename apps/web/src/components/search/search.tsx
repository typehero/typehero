'use client';

import * as React from 'react';
import { Button } from '@repo/ui/components/button';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import { SearchProvider } from './search-provider';
import { SearchContent } from './search-content';

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
