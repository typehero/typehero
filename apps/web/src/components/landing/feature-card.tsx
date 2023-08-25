'use client';

import type { Difficulty } from '@repo/db/types';
import { Button } from '@repo/ui';
import clsx from 'clsx';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { Check, Reply } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState, type MouseEvent } from 'react';
import { useInView } from 'react-intersection-observer';
import { z } from 'zod';
import { Markdown } from '../ui/markdown';
import { Steps } from '../wizard/Steps';
import { useIsMobile } from '~/utils/useIsMobile';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

function FeatureCard({
  title,
  description,
  bgClass,
  children,
}: CardProps & {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="animated-feature-cards relative w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          'group relative w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90',
          !isMobile && 'hover:border-transparent',
          bgClass,
        )}
      >
        <div className="mx-10 my-10 min-h-[450px] w-full">
          <div className="flex w-4/6 flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-xl">{title}</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

export function ImageCard({
  image,
  imgClass1,
  imgClass2,
  ...props
}: CardProps & {
  imgClass1?: string;
  imgClass2?: string;
  image: {
    dark1: StaticImageData;
    dark2: StaticImageData;
    light1: StaticImageData;
    light2: StaticImageData;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  return (
    <FeatureCard {...props}>
      <>
        {resolvedTheme === 'light' && (
          <>
            <Image
              alt={image.alt}
              className={imgClass1}
              src={image.light1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />

            <Image
              alt={image.alt}
              className={imgClass2}
              src={image.light2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
        {resolvedTheme === 'dark' && (
          <>
            <Image
              alt={image.alt}
              className={imgClass1}
              src={image.dark1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
            <Image
              alt={image.alt}
              className={imgClass2}
              src={image.dark2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
      </>
    </FeatureCard>
  );
}

export function ChallengeCreationCard({
  image,
  step1img1Class,
  step1img2Class,
  step2img1Class,
  step2img2Class,
  step3imgClass,
  ...props
}: CardProps & {
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  image: {
    step1dark1: StaticImageData;
    step1dark2: StaticImageData;
    step1light1: StaticImageData;
    step1light2: StaticImageData;
    step2dark1: StaticImageData;
    step2dark2: StaticImageData;
    step2light1: StaticImageData;
    step2light2: StaticImageData;
    step3dark: StaticImageData;
    step3light: StaticImageData;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  const { currentNumber: step, increment } = useNumberCycler();
  const steps = [
    { id: '1', name: '💳 Card', schema: z.any() },
    { id: '2', name: '📄 Prompt', schema: z.any() },
    { id: '3', name: '📔 Tests', schema: z.any() },
    { id: '4', name: '🚀 Submit', schema: z.any() },
  ];
  return (
    <FeatureCard {...props}>
      <div
        className={clsx(
          { 'translate-x-0 opacity-0': step < 3 },
          'absolute left-1/2 top-1/2 flex w-[80%] -translate-x-1/2 -translate-y-[33%] flex-col gap-12 text-center text-2xl font-bold transition-all duration-500 md:w-[50%]',
        )}
      >
        <div>🎉</div>
        <div className="opacity-80">Thanks for creating a challenge!</div>
      </div>
      {resolvedTheme === 'light' && (
        <>
          {/* step 1 */}
          <Image
            alt={image.alt}
            className={clsx(step1img1Class, { '-translate-x-36 opacity-0': step > 0 })}
            src={image.step1light1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
            alt={image.alt}
            className={clsx(step1img2Class, { '-translate-x-24 opacity-0': step > 0 })}
            src={image.step1light2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 2 */}
          <Image
            alt={image.alt}
            className={clsx(
              step2img1Class,
              { 'translate-x-36 opacity-0': step < 1 },
              { '-translate-x-36 opacity-0': step > 1 },
            )}
            src={image.step2light1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
            alt={image.alt}
            className={clsx(
              step2img2Class,
              { 'translate-x-24 opacity-0': step < 1 },
              { '-translate-x-24 opacity-0': step > 1 },
            )}
            src={image.step2light2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          {/* step 3 */}
          <Image
            alt={image.alt}
            className={clsx(
              step3imgClass,
              { 'translate-x-36 opacity-0': step < 2 },
              { '-translate-x-36 opacity-0': step > 2 },
              { 'opacity-90': step === 2 },
            )}
            src={image.step3light}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
        </>
      )}
      {resolvedTheme === 'dark' && (
        <>
          {/* step 1 */}
          <Image
            alt={image.alt}
            className={clsx(step1img1Class, { '-translate-x-36 opacity-0': step > 0 })}
            src={image.step1dark1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
            alt={image.alt}
            className={clsx(step1img2Class, { '-translate-x-24 opacity-0': step > 0 })}
            src={image.step1dark2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 2 */}
          <Image
            alt={image.alt}
            className={clsx(
              step2img1Class,
              { 'translate-x-36 opacity-0': step < 1 },
              { '-translate-x-36 opacity-0': step > 1 },
            )}
            src={image.step2dark1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
            alt={image.alt}
            className={clsx(
              step2img2Class,
              { 'translate-x-24 opacity-0': step < 1 },
              { '-translate-x-24 opacity-0': step > 1 },
            )}
            src={image.step2dark2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 3 */}
          <Image
            alt={image.alt}
            className={clsx(
              step3imgClass,
              { 'translate-x-36 opacity-0': step < 2 },
              { '-translate-x-36 opacity-0': step > 2 },
              { 'opacity-90': step === 2 },
            )}
            src={image.step3dark}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <div className="absolute -right-4 bottom-4 w-full">
            <Steps current={step} onChange={() => {}} steps={steps} />
          </div>
        </>
      )}
      <div
        className="absolute left-0 top-0 z-50 h-full w-full cursor-pointer"
        onClick={() => increment()}
      />
    </FeatureCard>
  );
}

const solutionComment = `\`\`\`ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
  \`\`\``;

function Badge({ name }: { name: string }) {
  return (
    <Button
      tabIndex={-1}
      className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
      size="sm"
    >
      @{name}
    </Button>
  );
}
export function CollaborativeEnvironmentCard(props: CardProps) {
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <FeatureCard {...props}>
      <div
        ref={ref}
        className="absolute inset-0 left-[23px] top-[35%] flex w-[100%] flex-col gap-3 pt-4 max-md:scale-90 md:left-[37px] md:top-[30%]"
      >
        <div
          className={clsx(
            { comment1: inView },
            'rounded-l-3xl bg-neutral-500/10 p-4 pt-3 opacity-0 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <div className="flex items-center gap-2">
            <Badge name="dax" />
            <div className="text-xs text-neutral-500">5 years ago</div>
          </div>
          Implementing Pick in TypeScript is hard, can anyone help?
        </div>
        <div
          className={clsx(
            { comment2: inView },
            'relative ml-12 rounded-l-3xl bg-neutral-500/10 p-4 pt-3 opacity-0 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <Reply className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <Badge name="trash" />
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          ez, the answer is
          <Markdown>{solutionComment}</Markdown>
        </div>
        <div
          className={clsx(
            { comment3: inView },
            'relative ml-12 rounded-tl-3xl bg-neutral-500/10 p-4 pt-3 opacity-0 duration-150',
            !isMobile && 'hover:bg-neutral-500/20',
          )}
        >
          <Reply className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <Badge name="nikita" />
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          <Image
            className={clsx({ amoguwusus: inView }, 'opacity-0')}
            alt="amoguwuawa"
            src="/Red.webp"
            height="198"
            width="150"
          />
        </div>
      </div>
    </FeatureCard>
  );
}

export function CuratedTracksCard(props: CardProps) {
  return (
    <FeatureCard {...props}>
      <div
        className={clsx(
          'absolute inset-0 top-[50%] flex flex-col items-center justify-center',
          'max-md:scale-110 md:top-[38%]',
        )}
      >
        <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wide">
            Typescript Foundations
          </span>
        </div>

        {tracks.map((track) => (
          <Track key={track.id} {...track} />
        ))}
      </div>
    </FeatureCard>
  );
}

interface Track {
  className?: string;
  difficulty: Difficulty;
  id: string;
  label: string;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'text-pink-600 dark:text-pink-300',
  EASY: 'text-emerald-600 dark:text-emerald-300',
  MEDIUM: 'text-yellow-600 dark:text-yellow-300',
  HARD: 'text-red-600 dark:text-red-300',
  EXTREME: 'text-orange-600 dark:text-orange-300',
};

const BGS_BY_DIFFICULTY = {
  BEGINNER: 'bg-pink-600 dark:bg-pink-300',
  EASY: 'bg-emerald-600 dark:bg-emerald-300',
  MEDIUM: 'bg-yellow-600 dark:bg-yellow-300',
  HARD: 'bg-red-600 dark:bg-red-300',
  EXTREME: 'bg-orange-600 dark:bg-orange-300',
};

const tracks: Track[] = [
  {
    id: '2',
    label: 'Infer',
    difficulty: 'EASY',
  },
  {
    id: '3',
    label: 'Map Types',
    difficulty: 'MEDIUM',
  },
  {
    id: '5',
    label: 'Classes',
    difficulty: 'EXTREME',
  },
  {
    id: '4',
    label: 'Branded Types',
    difficulty: 'HARD',
  },
  {
    id: '1',
    label: 'Generics',
    difficulty: 'BEGINNER',
  },
];

function Track({ className, difficulty, id, label }: Track) {
  const isMobile = useIsMobile();
  return (
    <label
      htmlFor={id}
      className="group/challenge flex w-[69%] cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={clsx(
          'flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-lg bg-neutral-500/10 p-4 py-2 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 sm:py-4',
          className,
          !isMobile &&
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20',
        )}
      >
        <div className="relative flex items-center gap-3 text-xs sm:text-base">
          <input className="peer hidden appearance-none" type="checkbox" id={id} />
          <div className="h-5 w-5 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80" />
          <Check className="absolute left-1 my-auto h-3 w-3 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black" />
          {label}
        </div>
        <div
          className={`relative text-xs font-medium tracking-wide ${COLORS_BY_DIFFICULTY[difficulty]}`}
        >
          <div
            className={`absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 blur-3xl ${BGS_BY_DIFFICULTY[difficulty]}`}
          />
          {difficulty[0]}
          {difficulty.substring(1, difficulty.length).toLowerCase()}
        </div>
      </div>
    </label>
  );
}

function useNumberCycler() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [dummy, setDummy] = useState(0);

  const increment = () => {
    setCurrentNumber((prevNumber) => {
      return (prevNumber + 1) % 4;
    });

    setDummy((prev) => prev + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNumber((prevNumber) => {
        return (prevNumber + 1) % 4;
      });
    }, 5000);

    return () => {
      console.log('reset');
      clearInterval(intervalId);
    };
  }, [dummy]);

  return {
    increment,
    currentNumber,
  };
}
