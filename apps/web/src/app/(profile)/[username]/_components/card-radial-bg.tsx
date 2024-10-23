'use client';

import React from 'react';
import type { MotionStyle, MotionValue } from 'framer-motion';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useIsMobile } from '~/utils/useIsMobile';
import { cn } from '@repo/ui/cn';
import { Card } from '@repo/ui/components/card';
import styles from './card-radial-bg.module.css';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};
export function CardWithRadialBg(
  props: React.PropsWithChildren<{ gradient?: string; className?: string }>,
) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();

  function handleMouseMove(event: React.MouseEvent) {
    if (isMobile) return;
    const boundingRect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - boundingRect.left);
    mouseY.set(event.clientY - boundingRect.top);
  }
  return (
    <motion.div
      className={cn(
        styles['radial-bg'],
        'pointer-events-none relative md:pointer-events-auto',
        props.className,
      )}
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
          '--color-center': '#3aecf8',
          '--color-mid': '#5295dc',
          '--color-fade': 'rgba(255, 255, 255, 0)',
          '--color-outer': 'transparent',
        } as WrapperStyle
      }
    >
      <Card className="h-full border bg-transparent bg-gradient-to-br from-neutral-50 to-neutral-100 transition md:hover:border-transparent dark:from-neutral-900/95 dark:to-neutral-950/95">
        {props.children}
      </Card>
    </motion.div>
  );
}
