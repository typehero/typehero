'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Laptop, Moon, Sun } from '@repo/ui/icons';
import { cn } from '@repo/ui/cn';
import { motion } from 'framer-motion';

const themes = ['system', 'light', 'dark'] as const;

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn('flex items-center rounded-full border p-0.5')}>
      {themes.map((t) => {
        const isActive = theme === t;
        return (
          <motion.button
            key={t}
            className={cn('rounded-full p-1.5', isActive && 'bg-secondary')}
            onClick={() => setTheme(t)}
            aria-label="theme button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {t === 'system' && <Laptop aria-hidden="true" className="size-4" />}
            {t === 'light' && (
              <Sun
                aria-hidden="true"
                className={cn('size-4', isActive && 'fill-black dark:fill-white')}
              />
            )}
            {t === 'dark' && (
              <Moon
                aria-hidden="true"
                className={cn('size-4', isActive && 'fill-black dark:fill-white')}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
