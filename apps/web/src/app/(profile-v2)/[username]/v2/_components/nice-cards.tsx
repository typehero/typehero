'use client';

import React from 'react';
import type { MotionStyle, MotionValue } from 'framer-motion';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useIsMobile } from '~/utils/useIsMobile';
import { cn } from '@repo/ui/cn';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};
export function NiceCard(
  props: React.PropsWithChildren<{ gradient?: string; className?: string }>,
) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = useIsMobile();
  console.log('hi ?');
  function handleMouseMove(event: React.MouseEvent) {
    console.log('hi ?');
    if (isMobile) return;
    const boundingRect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - boundingRect.left);
    mouseY.set(event.clientY - boundingRect.top);
  }
  return (
    <motion.div
      className={cn('animated-feature-cards relative', props.className)}
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      {props.children}
    </motion.div>
  );
}
