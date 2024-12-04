import Link from 'next/link';
import { Binary, Github, Twitter } from '@repo/ui/icons';
import { ThemeButton } from './Navigation/theme-button';

export function Footsies() {
  return (
    <footer className="flex flex-col items-center gap-2 px-8 pb-12 text-sm font-light sm:px-16 sm:pb-20 sm:pt-6 md:px-0 md:py-12">
      <div className="container flex flex-col-reverse justify-between gap-2 md:flex-row md:items-end">
        <span>
          Built with <Binary className="inline-block h-5 w-5 text-[#31bdc6]" /> by the Trash Devs
          community.
        </span>
        <div className="flex items-center gap-2">
          <ThemeButton />
          <span className="px-2">|</span>
          <a
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg p-2"
            href="https://github.com/typehero/typehero"
          >
            <span className="sr-only">TypeHero on GitHub</span>
            <Github className="h-5 w-5 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white" />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg p-2"
            href="https://twitter.com/typeheroapp"
          >
            <span className="sr-only">TypeHero on Twitter</span>
            <Twitter className="h-5 w-5 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white" />
          </a>
        </div>
      </div>
      <div className="container flex flex-col justify-between gap-2 text-neutral-500 md:flex-row  md:items-end dark:text-neutral-400">
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
