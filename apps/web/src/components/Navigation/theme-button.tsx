'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from '@repo/ui/icons';

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <button
          aria-label="theme button"
          className="group rounded-lg p-2 focus:outline-[#2563EB]"
          onClick={() => {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          }}
          type="button"
        >
          {resolvedTheme === 'dark' && (
            <Moon
              aria-hidden="true"
              className="h-5 w-5 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white"
            />
          )}
          {resolvedTheme === 'light' && (
            <Sun
              aria-hidden="true"
              className="h-5 w-5 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white"
            />
          )}
        </button>
      ) : null}
    </>
  );
}
