import { Binary, Github, Twitter } from '@repo/ui/icons';
import Link from 'next/link';

export function Footsies() {
  return (
    <footer className="flex flex-col items-center gap-2 px-8 pb-12 text-sm font-light sm:px-16 sm:pb-20 sm:pt-6 md:px-0 md:py-12">
      <div className="container flex flex-col-reverse justify-between gap-2 md:flex-row md:items-end">
        <span>
          Built with <Binary className="inline-block h-5 w-5 text-[#31bdc6]" /> by the Trash Devs
          community.
        </span>
        <div className="flex gap-2">
          <a
            target="_blank"
            rel="noreferrer"
            className="group gap-1 md:inline-flex"
            href="https://github.com/typehero/typehero"
          >
            <Github className="h-4 w-4 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white" />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            className="group gap-1 md:inline-flex"
            href="https://twitter.com/typeheroapp"
          >
            <Twitter className="h-4 w-4 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white" />
          </a>
        </div>
      </div>
      <div className="container flex flex-col justify-between gap-2 text-neutral-500 dark:text-neutral-400  md:flex-row md:items-end">
        <span>
          <Link
            href="/privacy"
            className="dark:hover:text-primary-foreground transition-colors duration-300 hover:text-neutral-900 hover:underline"
          >
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link
            href="/tos"
            className="dark:hover:text-primary-foreground transition-colors duration-300 hover:text-neutral-900 hover:underline"
          >
            Terms of Service
          </Link>
        </span>
        <span>
          <div className="inline-block rotate-180">©</div>
          {new Date().getFullYear()} TypeHero
        </span>
      </div>
    </footer>
  );
}
