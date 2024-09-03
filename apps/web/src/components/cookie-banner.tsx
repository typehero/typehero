'use client';

import { Button } from '@repo/ui/components/button';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '~/utils/useLocalStorage';

export const CookieBanner = () => {
  const [mounted, setMounted] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useLocalStorage('cookie-banner', 'true');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || showCookieBanner === 'false') {
    return null;
  }

  return (
    <div className="fade-in fixed right-0 bottom-0 z-[999] flex w-full animate-in flex-col gap-2 rounded-t-2xl rounded-b-none border bg-background p-4 sm:right-2 sm:bottom-2 sm:w-[330px] sm:rounded-2xl">
      <div className="text-center font-semibold text-xl">TypeHero Uses Cookies 🍪</div>
      <div className="text-sm">
        We use cookies to improve your experience. By using TypeHero, you consent to our use of
        cookies.
      </div>
      <div className="flex gap-2 self-end">
        <Button variant="outline" size="sm" onClick={() => setShowCookieBanner('false')}>
          Close
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowCookieBanner('false')}>
          Ok
        </Button>
      </div>
    </div>
  );
};
