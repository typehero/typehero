'use client';
import { Binary } from '@repo/ui/icons';

export function Footsies() {
  return (
    <footer className="flex flex-col items-center text-sm font-light sm:px-16 md:px-0">
      <div className="container my-4 flex flex-col justify-between gap-6 px-10 pb-2 md:my-12 lg:flex-row">
        <div className="space-x-2">
          Built with <Binary className="inline-block h-5 w-5 text-[#31bdc6]" /> by the Trash Devs
          community. The source code will soon™️ be available on GitHub
        </div>
        <div className="text-neutral-500">© {new Date().getFullYear()} Type Hero</div>
      </div>
    </footer>
  );
}
