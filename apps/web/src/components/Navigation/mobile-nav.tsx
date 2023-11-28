'use client';
import { cn } from '@repo/ui/cn';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export function MobileNav({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //blocking scroll on open nav-menu
  useEffect(() => {
    if (mounted && open) {
      const body = document.getElementsByTagName('body')[0];
      body?.classList.add('mobile-nav-active');
    }
    if (mounted && !open) {
      const body = document.getElementsByTagName('body')[0];
      body?.classList.remove('mobile-nav-active');
    }
  }, [open, mounted]);

  return (
    mounted && (
      <>
        <div className="md:hidden">
          {/* Hamburger Icon */}
          <button
            className={cn(
              'hamburger  rounded-lg p-4 duration-300 focus:outline-none ',
              open ? 'is-active' : '',
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="line mb-2" />
            <span className="line mt-2" />
          </button>
        </div>
        <motion.div
          key={open ? 'open' : 'close'}
          initial={{ opacity: 0 }}
          // Clicking on link closes the nav
          onClickCapture={() => setOpen(false)}
          animate={{ opacity: 1 }}
          className={`bg-background/80 left-0 top-[55px] z-10 flex h-full w-full flex-1 snap-y flex-col gap-5 justify-self-center border-b p-3 backdrop-blur-md md:mt-0 md:hidden md:pb-0 ${
            open ? 'absolute block w-full' : 'hidden'
          }`}
        >
          {children}
        </motion.div>
      </>
    )
  );
}
