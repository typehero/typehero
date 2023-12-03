import { motion } from 'framer-motion';

export function Welcome() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
        }}
        exit={{
          opacity: 0,
        }}
        className="text-background flex h-full flex-col items-start justify-center gap-2"
      >
        <h2 className="text-4xl">
          Advent of <br /> <span className="text-green-500">{'<TypeScript>'}</span>
        </h2>
        <div className="text-6xl font-bold">Wrapped 2023</div>
      </motion.div>
    </>
  );
}
