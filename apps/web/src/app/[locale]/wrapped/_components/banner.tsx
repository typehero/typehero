import { motion, useScroll, useTransform } from 'framer-motion';

export function Banner() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, -10]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden text-center">
      <motion.h1
        style={{
          opacity,
        }}
        className="mb-10 text-center text-4xl font-bold tracking-tighter text-black dark:text-white sm:text-8xl"
      >
        <span>Advent</span> of <span className="text-red-600">TypeScript</span>
      </motion.h1>
      <motion.div
        style={{ scale }}
        className="text-3xl font-bold text-black dark:text-white sm:text-6xl"
      >
        Wrapped 2023 🎉
      </motion.div>
    </div>
  );
}
