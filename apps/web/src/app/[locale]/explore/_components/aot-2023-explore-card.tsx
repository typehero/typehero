//TODO: Delete after aot-2023
import { cn } from '@repo/ui/cn';
import { Circle, RectangleVertical, Triangle } from '@repo/ui/icons';

const HOLIDAY_COLORS_BY_DIFFICULTY = {
  BEGINNER: 'group-hover/card:text-difficulty-beginner',
  EASY: 'group-hover/card:text-yellow-300',
  MEDIUM: 'group-hover/card:text-difficulty-medium',
  HARD: 'group-hover/card:text-difficulty-hard',
  EXTREME: 'group-hover/card:text-difficulty-extreme',
} as Record<string, string>;

const BALLS_POSITION_BY_DIFFICULTY = {
  BEGINNER: [
    { right: '78', top: '45' },
    { right: '32', top: '120' },
  ],
  EASY: [
    { right: '40', top: '20' },
    { right: '79', top: '75' },
    { right: '32', top: '105' },
  ],
  MEDIUM: [
    { right: '40', top: '15' },
    { right: '24', top: '56' },
    { right: '65', top: '80' },
    { right: '38', top: '140' },
  ],
  HARD: [
    { right: '40', top: '15' },
    { right: '24', top: '56' },
    { right: '70', top: '80' },
    { right: '32', top: '120' },
  ],
  EXTREME: [
    { right: '40', top: '15' },
    { right: '24', top: '56' },
    { right: '70', top: '80' },
    { right: '32', top: '120' },
    { right: '70', top: '140' },
  ],
} as Record<string, { right: string; top: string }[]>;

function HolidayChristmasBall({
  right,
  top,
  className,
}: {
  right: string;
  top: string;
  className?: string;
}) {
  return (
    <Circle
      className={cn(
        'absolute z-40 h-4 w-4 animate-pulse fill-current stroke-[0.5] text-black/10 opacity-0 blur-sm delay-300 duration-1000 group-hover/card:text-red-500 group-hover/card:opacity-100',
        className,
      )}
      style={{
        top,
        right,
      }}
    />
  );
}

export function HolidayChristmasTree({ difficulty }: { difficulty: string }) {
  const className = HOLIDAY_COLORS_BY_DIFFICULTY[difficulty];
  const balls = BALLS_POSITION_BY_DIFFICULTY[difficulty];

  return (
    <>
      <Triangle className="absolute -right-5 -top-5 h-16 w-16 rotate-0 stroke-[0.75]  text-black/10 opacity-10 duration-500 group-hover/card:-translate-x-[56px] group-hover/card:translate-y-32 group-hover/card:rotate-12 group-hover/card:scale-[2] group-hover/card:text-green-600/50 group-hover/card:opacity-100 dark:text-white " />
      <Triangle className="absolute -right-14  -top-16  h-32 w-32 rotate-12 stroke-[0.4] text-black/10 opacity-10 duration-300 group-hover/card:-translate-x-10 group-hover/card:translate-y-8 group-hover/card:stroke-[0.66] group-hover/card:text-green-600/50  group-hover/card:opacity-100 dark:text-white" />
      <Triangle className="absolute -right-20  h-32 w-32 rotate-12 stroke-[0.4] text-black/10 opacity-10 duration-300 group-hover/card:-translate-x-[72px] group-hover/card:translate-y-6 group-hover/card:stroke-[0.66]  group-hover/card:text-green-600/50  group-hover/card:opacity-100 dark:text-white " />
      <RectangleVertical className="absolute -bottom-10 right-0 h-16 w-16 text-black/10 opacity-0 duration-300 group-hover/card:-translate-x-[48px] group-hover/card:-translate-y-10 group-hover/card:rotate-12 group-hover/card:text-yellow-950/50 group-hover/card:opacity-100 dark:text-white" />
      {balls?.map((ball, idx) => (
        <HolidayChristmasBall key={idx} right={ball.right} top={ball.top} className={className} />
      ))}
    </>
  );
}
