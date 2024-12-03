'use client';

import { Star } from '@repo/ui/icons';
import { motion } from 'framer-motion';

export default function DayUnsolved({ day, active }: { day: number; active: boolean }) {
  const currentDay = new Date().getDate() === day;

  return (
    <motion.div
      key={day}
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: day * 0.025, type: 'spring', damping: 3, stiffness: 100 }}
      className="group aspect-square rounded-xl p-[1.5px] duration-300 hover:scale-110 hover:rounded-2xl"
    >
      <div
        className={`relative grid aspect-square h-12 w-12 place-items-center overflow-hidden rounded-xl duration-300 group-hover:rounded-2xl  ${
          day === 22 && 'h-14'
        }`}
      >
        {active ? null : <div className="candy-cane absolute inset-0" />}
        {currentDay ? (
          <Star className="absolute right-1 top-1 z-50 h-3 w-3 select-none fill-yellow-600 text-yellow-600 dark:fill-yellow-300 dark:text-yellow-300" />
        ) : null}
        <h1 className="z-10 font-bold">{day}</h1>
      </div>
    </motion.div>
  );
}
