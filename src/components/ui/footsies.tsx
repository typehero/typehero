'use client';
import { Keyboard as KeyboardIcon } from 'lucide-react';

export function Footsies() {
  return (
    <footer className="flex flex-col items-center text-sm font-light">
      {/* squiggly divider line */}
      <svg
        aria-hidden="true"
        width="100%"
        height="8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
          <g clipPath="url(#clip0_2426_11367)">
            <path
              d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
              strokeLinecap="square"
              className="stroke-neutral-400 dark:stroke-neutral-700"
            />
          </g>
        </pattern>
        <rect width="100%" height="100%" fill="url(#a)" />
      </svg>
      {/* <h2 className="text-4xl font-bold">Early birds get the perks</h2>
      <p className="max-w-[50ch] bg-transparent px-8 lg:px-0 text-center lg:text-left text-black/50 dark:text-white/50">
        TypeHero is currently under construction. We’ll
        let you know as soon as it’s ready! 
      </p> */}
      <div className="container my-12 flex flex-col justify-between gap-6 px-10 pb-2   lg:flex-row">
        <div className="space-x-2">
          Built with <KeyboardIcon className="inline-block h-4 w-4 text-blue-500" /> by the Trash
          Devs community. The source code will soon™️ be available on GitHub
        </div>
        <div className="text-neutral-500">© 2069 Type Hero</div>
      </div>
    </footer>
  );
}
