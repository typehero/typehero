'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { type MouseEvent } from 'react';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

export const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="animated-feature-cards h-full w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <motion.div className="b-black/90 h-full w-full rounded-xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 px-6 py-10 backdrop-blur-2xl transition duration-300 hover:border-transparent dark:from-neutral-950/90 dark:to-neutral-900/90">
        <div className="flex flex-col items-center gap-4">
          {icon}
          <h2 className="text-xl font-bold tracking-tight md:text-3xl">{title}</h2>
          <p className="text-center text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
