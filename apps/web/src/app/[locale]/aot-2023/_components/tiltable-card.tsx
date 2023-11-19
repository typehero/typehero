'use client';
import { motion } from 'framer-motion';
import { useRef, useState, type MouseEvent } from 'react';
import type { Challenges } from './card-grid';
import Image from 'next/image';

interface Props {
  challenge: Challenges[0] & { isRevealed: boolean };
  index: number;
}

const IMAGES = [
  'gingerbreadman2',
  'bell',
  'candle',
  'candycane',
  'santatree',
  'gift2',
  'chimney',
  'christmas_tree',
  'firework',
  'gift',
  'gingerbreadman',
  'leaf',
  'lollypop',
  'ornament',
  'santasnowball',
  'singingcandles',
  'sled',
  'snowflake',
  'snowman',
  'sock',
  'star',
  'sunglasses',
  'twohands',
  'wreath',
  '25',
];
export function TiltableCard({ index, challenge }: Props) {
  const [rotations, setRotations] = useState({ x: 0, y: 0, z: 0 });
  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingReference = useRef(isAnimating);
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });

  const animate = (event: MouseEvent) => {
    setAnimating(true);

    const rect = event.currentTarget.getBoundingClientRect();

    const absolute = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    };

    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    setRotations({
      x: round(((center.x > 50 ? 1 : -1) * center.x) / 12),
      y: round(center.y / 16),
      z: round(distance(percent.x, percent.y, 50, 50) / 20),
    });

    setGlare({
      x: percent.x,
      y: percent.y,
      opacity: 0.25,
    });
  };

  const stopAnimating = () => {
    setAnimating(false);

    setTimeout(() => {
      if (isAnimatingReference.current) return;

      setRotations({ x: 0, y: 0, z: 2 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, 100);
  };

  return (
    <motion.div
      onMouseMove={animate}
      onMouseLeave={stopAnimating}
      animate={{
        rotateY: rotations.x,
        rotateX: rotations.y,
        transformPerspective: rotations.z * 100,
      }}
      style={{
        height: '320px',
        backgroundColor: '#175f2c',
        borderRadius: '0.5rem',
        boxShadow:
          '0 0 0 1px rgba(0, 0, 0, 0.105), 0 9px 20px 0 rgba(0, 0, 0, 0.02), 0 1px 2px 0 rgba(0, 0, 0, 0.106)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center',
        perspective: '320px',
      }}
    >
      <motion.div
        style={{
          zIndex: 2,
          mixBlendMode: 'overlay',
          position: 'absolute',
          transform: 'translateZ(1px)',
          width: '100%',
          height: '100%',
          borderRadius: '0.5rem',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          background: `radial-gradient(
            farthest-corner circle at ${glare.x}% ${glare.y}%,
            rgba(255, 255, 255, 0.7) 10%,
            rgba(255, 255, 255, 0.5) 24%,
            rgba(0, 0, 0, 0.8) 82%
          )`,
          opacity: glare.opacity,
        }}
      />
      <Image src={`/aot/${IMAGES[index]}.png`} width={100} height={100} alt="" />
      <p className="absolute bottom-4 right-4 text-xl font-bold text-white">{index + 1}</p>
    </motion.div>
  );
}

export function round(num: number, fix = 2) {
  return parseFloat(num.toFixed(fix));
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
