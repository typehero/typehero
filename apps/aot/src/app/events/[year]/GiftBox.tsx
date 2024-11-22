'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gift1 from '~/../public/giftbox.png';
import gift2 from '~/../public/giftbox2.png';
import gift3 from '~/../public/giftbox3.png';

const gifts = [gift1, gift2, gift3];

export default function GiftBox({
  day,
  index,
}: {
  day: { id: number; active: boolean };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: day.id * 0.05, type: 'spring', damping: 3, stiffness: 100 }}
      className={`group relative h-12 w-12 cursor-pointer rounded-2xl duration-300 hover:bg-white/20 ${
        index == 2 && 'ml-20 mr-12'
      }`}
    >
      <Image
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none brightness-100 ${
          !day.active && 'opacity-50 grayscale'
        } group-hover:brightness-90 dark:brightness-50 ${
          index == 0 && '-translate-y-[calc(50%+0.5rem)]'
        }`}
        src={gifts[index]!}
        alt="Day 23"
        width={64}
        height={64}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
        {day.id}
      </div>
    </motion.div>
  );
}
