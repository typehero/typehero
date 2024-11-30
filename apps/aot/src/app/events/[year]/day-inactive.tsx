'use client';

import { motion } from 'framer-motion';

export default function DayInactive({ day }: { day: number }) {
  return (
    <motion.div
      key={day}
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: day * 0.025, type: 'spring', damping: 3, stiffness: 100 }}
      className="group aspect-square rounded-xl p-[1.5px] duration-300 hover:scale-110 hover:rounded-2xl"
    >
      <div
        className={`relative grid aspect-square h-12 w-12 cursor-wait place-items-center overflow-hidden rounded-xl border-2 border-dashed border-black/30 bg-white/20 backdrop-blur duration-300 group-hover:rounded-2xl group-hover:bg-white/50 dark:border-white/30 dark:bg-black/20 dark:group-hover:bg-black/50 ${
          day === 22 && 'h-14'
        }`}
      >
        <div className="candy-cane absolute inset-0" />

        <h1 className="z-10 font-bold">{day}</h1>
      </div>
    </motion.div>
  );
}
