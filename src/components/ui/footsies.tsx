'use client';
import { Keyboard as KeyboardIcon } from 'lucide-react';

export function Footsies() {
  return (
    <footer className="flex flex-col items-center text-sm font-light">
      <div className="container my-12 flex flex-col justify-between gap-6 px-10 pb-2 lg:flex-row">
        <div className="space-x-2">
          Built with <KeyboardIcon className="inline-block h-4 w-4 text-blue-500" /> by the Trash
          Devs community. The source code will soon™️ be available on GitHub
        </div>
        <div className="text-neutral-500 dark:text-neutral-400/75">© {new Date().getFullYear()} Type Hero</div>
      </div>
    </footer>
  );
}
