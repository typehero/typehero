'use client';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import styles from './moving-grid.module.css';
import { cn } from '@repo/ui/cn';
import { useIsMobile } from '~/utils/useIsMobile';

type WrapperStyle = MotionStyle & {
  '--x': MotionValue<string>;
  '--y': MotionValue<string>;
};

export function MovingGrid(props: React.PropsWithChildren<{}>) {
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
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden', styles['radial-bg'])}
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
      <motion.div className={cn('absolute h-[200%] w-full', styles['moving-grid-background'])} />
      <div className="shadow-background absolute h-full w-full shadow-[inset_0_0_5rem_3.5rem]" />
      {props.children}
    </motion.div>
  );
}
