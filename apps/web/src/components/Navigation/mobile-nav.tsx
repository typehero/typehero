'use client';
import { cn } from '@repo/ui/cn';
import React, { useEffect } from 'react';
import { NavLink } from './nav-link';
import type { mockFlags } from '~/utils/feature-flags';

interface Props {
  children: React.ReactNode;
}

export function MobileNav({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [mounted, isMounted] = React.useState(false);

  useEffect(() => {
    isMounted(true);
  }, []);

  return (
    mounted && (
      <>
        <div className="md:hidden">
          <button
            className={cn(
              'hamburger  rounded-lg p-4 duration-300 focus:outline-none ',
              open ? 'is-active' : '',
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* <Menu /> */}
            <span className="line mb-2" />
            <span className="line mt-2" />
          </button>
        </div>
        <div
          className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
            open ? 'absolute block w-full' : 'hidden'
          }`}
        >
          {children}
        </div>
      </>
    )
  );
}
