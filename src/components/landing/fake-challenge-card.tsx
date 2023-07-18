import { clsx } from 'clsx';

export type FakeChallengeCardProps = {
  title: string;
  className?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
};

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-pink-300 bg-pink-600',
  EASY: 'dark:bg-green-300 bg-green-600',
  MEDIUM:
    'dark:bg-yellow-300 bg-yellow-600',
  HARD: 'dark:bg-red-300 bg-red-600',
  EXTREME:
    'dark:bg-orange-300 bg-orange-600',
};

export const FakeChallengeCard = ({ title, className, difficulty }: FakeChallengeCardProps) => {
  return (
    <div
      className={clsx(className, {
        'flex w-[320px] flex-col gap-3 rounded-2xl border duration-300 border-neutral-300 bg-zinc-100 group/card hover:-skew-x-6 dark:hover:border-zinc-600 p-7 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1]':
          true,
      })}
    >
      <p className="translate-x-1 text-lg font-medium">{title}</p>
      <div className="flex gap-3">
        <div className={`duration-300 group-hover/card:-translate-x-1 group-hover/card:-translate-y-1 group-hover/card:shadow-[0.75rem_0.75rem_1rem_-0.25rem_#0008] inline-flex w-fit translate-x-1 items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold text-primary-foreground ${COLORS_BY_DIFFICULTY[difficulty || 'HARD']}`}>
          { difficulty || 'HARD' }
        </div>
        <div className="duration-300 group-hover/card:-translate-x-2 group-hover/card:-translate-y-1 group-hover/card:shadow-[0.75rem_0.75rem_1rem_-0.25rem_#0008] px-2.5 flex w-fit items-center justify-center rounded-full bg-transparent py-1 pl-1.5 pr-2 text-xs font-bold text-neutral-700 dark:bg-zinc-700 bg-neutral-300 dark:text-white">
          @you
        </div>
      </div>
      <div className="translate-x-1 text-xs">
        Implement the built-in <code>Pick</code> type.
      </div>
      <div className="h-56 mt-4 flex-grow rounded-xl group-hover/card:-translate-x-3 group-hover/card:-translate-y-3 group-hover/card:shadow-[1rem_1rem_2.5rem_-1rem_#0008] duration-300 bg-zinc-300/70 p-4 dark:bg-zinc-800/70">
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
