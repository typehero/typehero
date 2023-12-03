'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, type MouseEvent } from 'react';
import type { Challenges } from './card-grid';
import clsx from 'clsx';

interface Props {
  challenge: Challenges[0] & { isRevealed: boolean };
  index: number;
}
const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 40,
};

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
  const router = useRouter();
  // if a day has been solved it should just be flipped
  const [isFlipped, setIsFlipped] = useState(challenge.hasSolved);

  const [rotations, setRotations] = useState({ x: 0, y: 0, z: 0 });
  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingReference = useRef(isAnimating);
  const [glare, setGlare] = useState({ x: 0, y: 0, opacity: 0 });

  const handleClick = () => {
    if (!challenge.isRevealed || challenge.hasSolved) return;
    setIsFlipped((prevState) => !prevState);
  };

  const animate = (event: MouseEvent) => {
    if (!challenge.isRevealed || challenge.hasSolved) return;
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
    if (!challenge.isRevealed) return;
    setAnimating(false);

    setTimeout(() => {
      if (isAnimatingReference.current) return;

      setRotations({ x: 0, y: 0, z: 2 });
      setGlare({ x: 50, y: 50, opacity: 0 });
    }, 100);
  };

  return (
    <motion.div
      onClick={handleClick}
      transition={spring}
      style={{
        height: '320px',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? -180 : 0 }}
        transition={spring}
        style={{
          width: '100%',
          height: '100%',
          zIndex: isFlipped ? 0 : 1,
          backfaceVisibility: 'hidden',
          position: 'absolute',
        }}
      >
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
            backgroundColor: challenge.hasSolved ? '#175f2c' : '#761111',
            ...(!challenge.isRevealed ? { filter: 'grayscale(100%)' } : {}),
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
          <Image
            src={`/aot/${IMAGES[index]}.png`}
            width={100}
            height={100}
            alt=""
            className={clsx(!challenge.isRevealed && 'opacity-50')}
          />
          <p
            className={clsx(
              'absolute bottom-4 right-4 text-xl font-bold text-white',
              !challenge.isRevealed && 'opacity-50',
            )}
          >
            {index + 1}
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/challenge/${challenge.slug}`);
        }}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={spring}
        style={{
          width: '100%',
          height: '100%',
          zIndex: isFlipped ? 1 : 0,
          backfaceVisibility: 'hidden',
          position: 'absolute',
          cursor: 'pointer',
        }}
      >
        <motion.div
          className="aot-card"
          onMouseMove={animate}
          onMouseLeave={stopAnimating}
          animate={{
            rotateY: rotations.x,
            rotateX: rotations.y,
            transformPerspective: rotations.z * 100,
          }}
          style={{
            height: '320px',
            backgroundColor: challenge.hasSolved ? '#175f2c' : '#761111',
            borderRadius: '0.5rem',
            boxShadow:
              '0 0 0 1px rgba(0, 0, 0, 0.105), 0 9px 20px 0 rgba(0, 0, 0, 0.02), 0 1px 2px 0 rgba(0, 0, 0, 0.106)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transformOrigin: 'center',
            perspective: '320px',
            overflow: 'hidden',
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
          {Boolean(challenge.hasSolved) && (
            <div className="absolute left-[-46px] top-[12px] w-[170px] -rotate-45 transform bg-gradient-to-r from-yellow-400 to-yellow-100 py-1 font-semibold text-black drop-shadow-md">
              <span className="ml-12">Solved</span>
            </div>
          )}
          <p className="text-xl font-bold text-white">{challenge.name}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function round(num: number, fix = 2) {
  return parseFloat(num.toFixed(fix));
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
