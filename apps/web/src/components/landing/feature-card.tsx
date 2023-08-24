'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { useTheme } from 'next-themes';
import { DifficultyBadge, UserBadge } from '@repo/ui';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { Check, Reply } from 'lucide-react';
import clsx from 'clsx';
import type { Difficulty } from '@repo/db/types';
import { useInView } from 'react-intersection-observer';
import { Markdown } from '../ui/markdown';
import { useIsMobile } from '~/utils/useIsMobile';
import Amog from '~/assets/images/amog.webp';

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

const solutionComment = `\`\`\`ts
// CODE START
type Get<T, K> = string
  \`\`\``;

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
            <UserBadge username="abc" linkComponent={Link} />
            <div className="text-xs text-neutral-500">5 years ago</div>
          </div>
          pls halp i give ap
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
            <UserBadge username="defg" linkComponent={Link} />
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
            <UserBadge username="69" linkComponent={Link} />
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          <Image
            className={clsx({ amoguwusus: inView }, 'opacity-0')}
            alt="amoguwuawa"
            src={Amog}
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
          'absolute inset-0 top-[90%] flex flex-col items-center justify-center',
          'max-md:scale-110 md:top-[38%]',
        )}
      >
        <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-2xl bg-neutral-500/10 p-2 pl-3">
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wide">
            Array / String
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

const tracks: Track[] = [
  {
    id: '1',
    label: 'Awaited',
    difficulty: 'BEGINNER',
  },
  {
    id: '2',
    label: 'Unshift',
    difficulty: 'EASY',
  },
  {
    id: '3',
    label: 'Append Argument',
    difficulty: 'MEDIUM',
  },
  {
    id: '4',
    label: 'CamelCase',
    difficulty: 'HARD',
  },
  {
    id: '5',
    label: 'Get Readonly Keys',
    difficulty: 'EXTREME',
  },
];

function Track({ className, difficulty, id, label }: Track) {
  const isMobile = useIsMobile();
  return (
    <div className="group/challenge flex w-full flex-col items-center pt-2">
      <label
        htmlFor={id}
        className={clsx(
          'flex w-[69%] cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 group-active/challenge:scale-100 group-active/challenge:duration-75 dark:text-zinc-300',
          className,
          !isMobile &&
            'group-hover/challenge:scale-105 group-hover/challenge:rounded-xl group-hover/challenge:bg-neutral-500/20',
        )}
      >
        <div className="relative flex items-center gap-3">
          <input className="peer hidden appearance-none" type="checkbox" id={id} />
          {/* <div className="h-5 w-5 rounded-full border-2 border-white/50 bg-white/10 peer-checked:bg-emerald-300/70" />
          <Check className="invisible absolute left-1 my-auto h-3 w-3 peer-checked:visible" /> */}
          {label}
        </div>
        <div className="group">
          <DifficultyBadge difficulty={difficulty} />
        </div>
      </label>
    </div>
  );
}
