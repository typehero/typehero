'use client';
import { Star } from '@repo/ui/icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gift1 from '~/../public/giftbox.png';
import gift2 from '~/../public/giftbox2.png';
import gift3 from '~/../public/giftbox3.png';

const gifts = [gift1, gift2, gift3];

export default function GiftBox({
  day,
  active,
  index,
  hasSolved,
}: {
  day: number;
  active: boolean;
  hasSolved: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: day * 0.025, type: 'spring', damping: 3, stiffness: 100 }}
      className={`group relative h-12 w-12 cursor-pointer rounded-2xl duration-300 hover:bg-white/20 ${
        index == 2 && 'ml-20 mr-12'
      }`}
    >
      {hasSolved ? (
        <Star className="absolute right-1 top-1 z-50 h-3 w-3 select-none fill-yellow-600 text-yellow-600 dark:fill-yellow-300 dark:text-yellow-300" />
      ) : null}
      <Image
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none brightness-100 ${
          !active && 'opacity-50 grayscale'
        } group-hover:brightness-90 dark:brightness-50 ${
          index == 0 && '-translate-y-[calc(50%+0.5rem)]'
        }`}
        src={gifts[index]!}
        alt="Day 23"
        width={64}
        height={64}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
        {day}
      </div>
    </motion.div>
  );
}
