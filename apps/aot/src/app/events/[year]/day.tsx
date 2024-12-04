'use client';
import star from '~/../public/star.png';
import Image from 'next/image';

import { motion } from 'framer-motion';
import { Star } from '@repo/ui/icons';

import gift1 from '~/../public/giftbox.png';
import gift2 from '~/../public/giftbox2.png';
import gift3 from '~/../public/giftbox3.png';

const gifts = [gift1, gift2, gift3];

const colorsArray = [
  'from-blue-200 dark:from-blue-800 via-blue-600 dark:via-blue-400 to-blue-100 dark:to-blue-900',
  'from-green-200 dark:from-green-800 via-green-600 dark:via-green-400 to-green-100 dark:to-green-900',
  'from-yellow-200 dark:from-yellow-800 via-yellow-600 dark:via-yellow-400 to-yellow-100 dark:to-yellow-900',
  'from-red-200 dark:from-red-800 via-red-600 dark:via-red-400 to-red-100 dark:to-red-900',
  'from-purple-200 dark:from-purple-800 via-purple-600 dark:via-purple-400 to-purple-100 dark:to-purple-900',
  'from-pink-200 dark:from-pink-800 via-pink-600 dark:via-pink-400 to-pink-100 dark:to-pink-900',
];

const dimmedColors = [
  'from-blue-100 dark:from-blue-900 via-blue-200 dark:via-blue-800 to-blue-50 dark:to-blue-950',
  'from-green-100 dark:from-green-900 via-green-200 dark:via-green-800 to-green-50 dark:to-green-950',
  'from-yellow-100 dark:from-yellow-900 via-yellow-200 dark:via-yellow-800 to-yellow-50 dark:to-yellow-950',
  'from-red-100 dark:from-red-900 via-red-200 dark:via-red-800 to-red-50 dark:to-red-950',
  'from-purple-100 dark:from-purple-900 via-purple-200 dark:via-purple-800 to-purple-50 dark:to-purple-950',
  'from-pink-100 dark:from-pink-900 via-pink-200 dark:via-pink-800 to-pink-50 dark:to-pink-950',
];

const unsolvedDashedBorder =
  'border-2 border-dashed border-black/30 bg-white/20 backdrop-blur group-hover:bg-white/50 dark:border-white/30 dark:bg-black/20 dark:group-hover:bg-black/50';

const solidBackground =
  'bg-white/50 backdrop-blur group-hover:bg-white/70 dark:bg-black/70 dark:group-hover:bg-black/50';

interface DayProps {
  day: number;
  active: boolean;
  hasSolved: boolean;
}

export default function DaySolved({ day, active, hasSolved }: DayProps) {
  return (
    <motion.div
      key={day}
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: day * 0.025, type: 'spring', damping: 3, stiffness: 100 }}
      className={`group aspect-square rounded-xl duration-300 hover:scale-110 hover:rounded-2xl
        ${(day === 22 || day === 23 || day === 25) && 'hover:bg-black/20 dark:hover:bg-white/20'}
        ${day === 25 && 'mr-12'}
        ${day === 22 && '-mr-4'}
        ${
          hasSolved &&
          day !== 1 &&
          day !== 22 &&
          day !== 23 &&
          day !== 25 &&
          `bg-gradient-to-br ${colorsArray[day % 6]}`
        }
      ${
        active &&
        !hasSolved &&
        day !== 22 &&
        day !== 23 &&
        day !== 25 &&
        `bg-gradient-to-br ${dimmedColors[day % 6]}`
      } p-[1.5px]`}
    >
      <div
        className={`relative grid aspect-square h-12 w-12 cursor-pointer place-items-center overflow-hidden rounded-xl duration-300 group-hover:rounded-2xl
          ${!hasSolved && day !== 22 && day !== 23 && day !== 25 && unsolvedDashedBorder} ${
            day !== 1 && day !== 22 && day !== 23 && day !== 25 && hasSolved && solidBackground
          }
          ${day === 24 && 'h-14'}
        `}
      >
        {active
          ? null
          : day !== 22 &&
            day !== 23 &&
            day !== 25 && <div className="candy-cane-neutral absolute inset-0" />}
        {hasSolved && day !== 1 ? (
          <Star className="absolute right-1 top-1 z-50 h-3 w-3 select-none fill-yellow-600 text-yellow-600 dark:fill-yellow-300 dark:text-yellow-300" />
        ) : null}
        {hasSolved && day === 1 ? (
          <Image
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none brightness-100 grayscale-0 group-hover:brightness-90 dark:brightness-50"
            src={star}
            alt="Day 23"
            width={64}
            height={64}
          />
        ) : null}
        {day === 22 || day === 23 || day === 25 ? (
          <Image
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none brightness-50 ${
              !active && 'opacity-50 grayscale'
            } group-hover:brightness-90 dark:brightness-50 ${
              day == 22 && '-translate-y-[calc(50%+0.5rem)]'
            }`}
            src={day === 22 ? gifts[0]! : day === 23 ? gifts[1]! : gifts[2]!}
            alt={`Day ${day}`}
            width={64}
            height={64}
          />
        ) : null}
        <h1
          className={`z-10 font-bold ${(day === 22 || day === 23 || day === 25) && 'text-white'}`}
        >
          {day}
        </h1>
      </div>
    </motion.div>
  );
}
