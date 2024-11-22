'use client';
import { motion } from 'framer-motion';

export default function BgDecorations() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, transform: 'rotateX(69deg) translate(-50%, 115%)' }}
        animate={{ opacity: 1, transform: 'rotateX(69deg) translate(-50%, 135%)' }}
        transition={{ delay: 22 * 0.05, type: 'spring' }}
        className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] overflow-hidden rounded-full bg-black/5 dark:bg-white/5"
        style={{
          perspective: '1000px',
        }}
      />
      <motion.div
        initial={{ opacity: 0, transform: 'rotateX(69deg) translate(-50%, 125%)' }}
        animate={{ opacity: 1, transform: 'rotateX(69deg) translate(-50%, 145%)' }}
        transition={{ delay: 24 * 0.05, type: 'spring' }}
        className="absolute bottom-0 left-1/2 h-[35rem] w-[35rem] overflow-hidden rounded-full bg-black/5 dark:bg-white/5"
        style={{
          perspective: '1000px',
        }}
      />
      <motion.div
        initial={{ opacity: 0, transform: 'rotateX(69deg) translate(-50%, 135%)' }}
        animate={{ opacity: 1, transform: 'rotateX(69deg) translate(-50%, 155%)' }}
        transition={{ delay: 26 * 0.05, type: 'spring' }}
        className="absolute bottom-0 left-1/2 h-[40rem] w-[40rem] overflow-hidden rounded-full bg-black/5 dark:bg-white/5"
        style={{
          transform: 'rotateX(69deg) translate(-50%, 155%)',
          perspective: '1000px',
        }}
      />
      <motion.div
        initial={{ opacity: 0, transform: 'rotateX(69deg) translate(-50%, 115%)' }}
        animate={{ opacity: 1, transform: 'rotateX(69deg) translate(-50%, 135%)' }}
        transition={{ delay: 22 * 0.05, type: 'spring' }}
        className="absolute bottom-0 left-1/2 h-96 w-96 overflow-hidden rounded-full bg-gradient-to-b from-pink-400/10 to-emerald-400/10 blur-xl"
        style={{
          perspective: '1000px',
        }}
      >
        <div className="absolute left-1/2 top-8 h-24 w-24 rounded-full bg-yellow-400/40 blur-2xl" />
        <div className="absolute bottom-32 left-1/2 h-24 w-24 rounded-full bg-purple-400/40 blur-2xl" />
        <div className="absolute bottom-8 left-1/2 h-24 w-24 rounded-full bg-rose-400/40 blur-2xl" />
      </motion.div>
    </>
  );
}
