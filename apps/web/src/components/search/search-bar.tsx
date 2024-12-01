import { Button } from '@repo/ui/components/button';
import { SearchIcon } from '@repo/ui/icons';

function isMacOS() {
  // TODO: Use a package or some such
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  return navigator.platform.toLowerCase().includes('mac');
}

export default function SearchBar({ setOpen }: { setOpen: (v: boolean) => void }) {
  const isMac = isMacOS();
  const cmdOrCtrl = isMac ? '⌘' : 'Ctrl ';
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
        className="text-muted-foreground mr-2 hidden w-64 justify-between gap-3 text-sm lg:inline-flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="sm:hidden">Search</span>
        <span className="hidden w-20 truncate text-left sm:inline-block md:w-full">
          Search Challenges...
        </span>
        <span className="whitespace-nowrap text-xs">{cmdOrCtrl}K</span>
      </Button>
    </>
  );
}
