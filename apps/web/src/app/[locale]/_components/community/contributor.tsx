'use client';

import Image from 'next/image';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export function Contributor({ contributor }: { contributor: Contributor }) {
  return (
    <a
      className="group relative rounded-full px-1.5 duration-300 hover:z-50 hover:scale-[1.2] focus:outline-none focus:duration-0 focus-visible:ring-0 active:scale-105 active:duration-100 lg:py-0.5"
      href={contributor.html_url}
      rel="noopener"
      target="_blank"
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-90 whitespace-nowrap rounded-full border bg-white/75 px-3 py-1 text-sm opacity-0 shadow-xl backdrop-blur-md duration-300 group-hover:scale-100 group-hover:opacity-100 dark:bg-black/50">
        {contributor.login}
      </span>
      <Image
        className="h-12 w-12 rounded-2xl bg-cover duration-300 group-hover:rounded-[2rem] group-focus:outline-none group-focus:duration-0 group-focus-visible:ring-2 group-active:rounded-3xl group-active:duration-100 sm:h-16 sm:w-16 sm:rounded-3xl"
        alt={`${contributor.login}'s GitHub avatar`}
        src={contributor.avatar_url}
        height={64}
        width={64}
      />
    </a>
  );
}
