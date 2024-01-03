'use client';

import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { SearchContent } from './search-content';
import { SearchProvider } from './search-provider';

const SearchBarWithNoSSR = dynamic(() => import('./search-bar'), {
  ssr: false,
});

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
        <SearchBarWithNoSSR setOpen={setOpen} />
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
