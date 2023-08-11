'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { useTheme } from 'next-themes';
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState, type MouseEvent } from 'react';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

export function FeatureCard({
  title,
  description,
  className,
  image,
}: {
  title: string;
  description: string;
  className?: string;
  image: {
    dark: StaticImageData;
    light: StaticImageData;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
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
      <motion.div className="b-black/90 group relative w-full overflow-hidden rounded-xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 backdrop-blur-2xl transition duration-300 hover:border-transparent dark:from-neutral-950/90 dark:to-neutral-800/90">
        <div className="mx-10 my-10 min-h-[450px] w-full">
          <div className="flex w-4/6 flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight md:text-xl">{title}</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          {mounted ? (
            <>
              {resolvedTheme === 'light' && (
                <Image
                  alt={image.alt}
                  className={className}
                  src={image.light}
                  style={{
                    position: 'absolute',
                    userSelect: 'none',
                    maxWidth: 'unset',
                  }}
                />
              )}
              {resolvedTheme === 'dark' && (
                <Image
                  alt={image.alt}
                  className={className}
                  src={image.dark}
                  style={{
                    position: 'absolute',
                    userSelect: 'none',
                    maxWidth: 'unset',
                  }}
                />
              )}
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
