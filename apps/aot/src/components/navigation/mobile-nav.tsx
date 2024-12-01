'use client';
import { cn } from '@repo/ui/cn';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
              'hamburger rounded-lg p-4 duration-300 focus:outline-none ',
              open ? 'is-active' : '',
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="line mb-2" />
            <span className="line mt-2" />
          </button>
        </div>
        <div
          key={open ? 'open' : 'close'}
          className={`bg-background/30 absolute left-0 top-[55px] z-50 flex h-full w-full flex-1 snap-y flex-col gap-5 justify-self-center border-b p-3 backdrop-blur-md duration-300 md:mt-0 md:hidden md:pb-0 ${
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-12 opacity-0'
          }`}
        >
          {children}
        </div>
      </>
    )
  );
}
