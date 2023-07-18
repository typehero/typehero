import { clsx } from 'clsx';

export type FakeChallengeCardProps = {
  title: string;
  className?: string;
};

export const FakeChallengeCard = ({ title, className }: FakeChallengeCardProps) => {
  return (
    <div
      className={clsx(className, {
        'flex w-[320px] flex-col gap-3 rounded-2xl border border-neutral-300 bg-zinc-100 p-7 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] backdrop-blur-md dark:border-neutral-800 dark:bg-zinc-900/80 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)]':
          true,
      })}
    >
      <p className="translate-x-1 text-lg font-medium">{title}</p>
      <div className="flex gap-3">
        <div className="inline-flex w-fit translate-x-1 items-center rounded-full border border-transparent bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground dark:bg-red-300">
          HARD
        </div>
        <div className="x-3 -ml-[0.33rem] flex h-auto w-fit items-center justify-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 dark:text-white">
          @you
        </div>
      </div>
      <div className="translate-x-1 text-xs">
        Implement the built-in <code>Pick</code> type.
      </div>
      <div className="h-56 flex-grow rounded-xl bg-zinc-300/70 p-4 dark:bg-zinc-800/70">
        <svg
          width="256"
          height="193"
          viewBox="0 0 256 193"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="234" height="9" rx="4.5" fill="#2B2B32" />
          <rect y="109" width="234" height="9" rx="4.5" fill="#2B2B32" />
          <rect y="90" width="234" height="9" rx="4.5" fill="#2B2B32" />
          <rect y="19" width="123" height="9" rx="4.5" fill="#544048" />
          <rect y="38" width="142" height="9" rx="4.5" fill="#544048" />
          <rect y="128" width="130" height="9" rx="4.5" fill="#544048" />
          <rect y="147" width="189" height="9" rx="4.5" fill="#544048" />
          <rect y="57" width="142" height="9" rx="4.5" fill="#404F54" />
          <rect y="166" width="142" height="9" rx="4.5" fill="#404F54" />
          <rect y="184" width="142" height="9" rx="4.5" fill="#404F54" />
        </svg>
      </div>
    </div>
  );
};
