'use client';

import { random } from 'lodash';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '@repo/ui/components/button';

export default function NotFoundScreen() {
  const baseText = `Page not found, sus`;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => baseText.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, baseText.length, {
      type: 'tween',
      duration: 2,
      delay: 4,
      ease: 'easeInOut',
    });
    return controls.stop;
  }, []);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden bg-black">
      <div className="sky">
        {Array(50)
          .fill(<></>)
          .map((_, i) => {
            const size = random(7) + 3;
            const animation_duration = random(30) + 15;
            const animation_delay = random(40) - 40;
            const top = random(101) - 1;
            return (
              <div
                key={i}
                className="star"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDuration: `${animation_duration}s`,
                  animationDelay: `${animation_delay}s`,
                  top: `${top}vh`,
                }}
              />
            );
          })}
      </div>
      <h1 className="font-mono text-4xl font-black text-white transition-all">404</h1>
      <div className="relative flex w-full flex-col justify-center">
        <Image src="/Red.webp" alt="red" height={100} width={100} className="boi" />
        <h2 className="absolute w-full text-center text-xl md:text-4xl">
          <motion.span className="text-white">{displayText}</motion.span>
        </h2>
      </div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 4,
          duration: 0.5,
        }}
      >
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
