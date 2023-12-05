import { cn } from '@repo/ui/cn';
import { Sparkle } from '@repo/ui/icons';
import Image from 'next/image';

export function FemPromo({ blurb, className }: { blurb: string; className?: string }) {
  // return (
  //   <div
  //     className={cn(
  //       'container flex flex-col items-center gap-5 pb-8 text-center md:gap-10 md:py-5 ',
  //       className,
  //     )}
  //   >
  //     <a href="https://frontendmasters.com/learn/typescript/" target="_blank" rel="noopener">
  //       <div className="mb-2 text-xl">{blurb}</div>
  //       <Image src="/fem.svg" width="400" height="150" alt="" />
  //     </a>
  //   </div>
  // );

  return (
    <a
      href="https://frontendmasters.com/learn/typescript"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/card relative flex w-full flex-col items-center justify-center overflow-hidden rounded-sm bg-zinc-200 p-4 text-center duration-300 dark:bg-zinc-900 md:max-w-[800px]',
        className,
      )}
    >
      <Sparkle className="group-hover/card:text-difficulty-extreme dark:group-hover/card:text-difficulty-extreme-dark absolute -right-4 -top-10 h-24 w-24 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-x-4 group-hover/card:translate-y-10 group-hover/card:-rotate-[125deg] dark:text-white/10" />
      <Sparkle className="group-hover/card:text-difficulty-extreme dark:group-hover/card:text-difficulty-extreme-dark absolute -left-1 bottom-1 h-48 w-48  -rotate-12 stroke-[0.33] text-black/10 duration-700 group-hover/card:-translate-y-5  group-hover/card:translate-x-5 group-hover/card:rotate-[160deg]  group-hover/card:scale-75 dark:text-white/10" />
      <div className="mb-2 md:text-xl">{blurb}</div>
      {/* <Image src="/fem.svg" width="400" height="150" alt="" /> */}
      <Image src="/fem-dark.png" width="400" height="150" alt="" className="hidden dark:block" />
      <Image src="/fem-light.png" width="400" height="150" alt="" className="dark:hidden" />
    </a>
  );
}
