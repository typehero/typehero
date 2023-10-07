'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/button';
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
    <div className="animate-in fade-in bg-background fixed bottom-0 right-0 z-[999] flex w-full flex-col gap-2 rounded-b-none rounded-t-2xl border p-4 sm:bottom-2 sm:right-2 sm:w-[330px] sm:rounded-2xl">
      <div className="text-center text-xl font-semibold">TypeHero Uses Cookies 🍪</div>
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
