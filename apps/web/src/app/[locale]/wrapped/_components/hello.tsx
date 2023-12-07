import { motion, useScroll, useTransform } from 'framer-motion';

export function Hello() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 1, 1]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden text-center">
      <motion.div
        style={{ scale }}
        className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-3xl bg-gradient-to-b from-blue-100 to-30% dark:from-blue-950 "
      >
        <p className="text-5xl sm:text-9xl">Let's Wrap this year</p>
        <p className="text-xl sm:text-3xl ">Are you ready?</p>
      </motion.div>
    </div>
  );
}
