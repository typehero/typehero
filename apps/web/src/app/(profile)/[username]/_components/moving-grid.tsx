'use client';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  useSpring,
} from 'framer-motion';
import styles from './moving-grid.module.css';
import { cn } from '@repo/ui/cn';
import { useIsMobile } from '~/utils/useIsMobile';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

export function MovingGrid(props: React.PropsWithChildren<{ className?: string }>) {
  const transition = { damping: 100, stiffness: 1000, type: 'spring' } as const;
  const mouseX = useMotionValue(43.5);
  const x = useSpring(mouseX, transition);
  const mouseY = useMotionValue(80);
  const y = useSpring(mouseY, transition);
  const isMobile = useIsMobile();

  function handleMouseMove(event: React.MouseEvent) {
    if (isMobile) return;
    const boundingRect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - boundingRect.left);
    y.set(event.clientY - boundingRect.top);
  }

  function handleMouseLeave() {
    if (isMobile) return;
    x.set(43.5);
    y.set(80);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', styles['radial-bg'], props.className)}
      style={
        {
          '--x': useMotionTemplate`${x}px`,
          '--y': useMotionTemplate`${y}px`,
          '--color-center': '#3aecf8',
          '--color-mid': '#5295dc',
          '--color-fade': 'rgba(255, 255, 255, 0)',
          '--color-outer': 'transparent',
        } as WrapperStyle
      }
    >
      <motion.div className={cn('absolute h-[200%] w-full', styles['moving-grid-background'])} />
      <div className="shadow-background absolute h-full w-full shadow-[inset_0_0_5rem_3.5rem]" />
      {props.children}
    </motion.div>
  );
}
