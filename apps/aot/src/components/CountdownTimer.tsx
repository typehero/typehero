'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const useAotCountdown = () => {
  const router = useRouter();
  const [releaseDate, setReleaseDate] = useState(() => calculateNextReleaseTime());
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDate.getTime() - Date.now()),
  );

  const aotEnded = Date.now() > new Date(Date.UTC(2024, 11, 25, 5, 0, 0)).getTime();

  useEffect(() => {
    // 05:00AM Dec 25, 2024 (UTC) <-> 00:00AM Dec 25, 2024 (EST)
    const aotEndTime = new Date(Date.UTC(2024, 11, 25, 5, 0, 0));
    if (Date.now() > aotEndTime.getTime()) {
      setRemainingTime(0);
      return;
    }

    const countdown = () => {
      const newRemainingTime = Math.max(0, releaseDate.getTime() - Date.now());
      setRemainingTime(newRemainingTime);

      if (newRemainingTime === 0) {
        const nextReleaseDateTime = calculateNextReleaseTime();
        setRemainingTime(nextReleaseDateTime.getTime() - Date.now());
        setReleaseDate(nextReleaseDateTime);
        router.refresh();
      }
    };

    const timerId = setInterval(countdown, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [releaseDate, router]);

  return { ...calculateTimeComponents(remainingTime), aotEnded };
};

const calculateNextReleaseTime = () => {
  const currentDate = new Date();
  const releaseTime = new Date(currentDate);
  releaseTime.setUTCHours(5, 0, 0, 0);

  // 05:00AM Dec 01, 2024 (UTC) <-> 00:00AM Dec 01, 2024 (EST)
  const decemberFirstReleaseTime = new Date(Date.UTC(2024, 11, 1, 5, 0, 0));

  if (currentDate < decemberFirstReleaseTime) {
    return decemberFirstReleaseTime;
  }

  if (releaseTime.getTime() <= currentDate.getTime()) {
    releaseTime.setUTCDate(releaseTime.getUTCDate() + 1);
  }

  return releaseTime;
};

const calculateTimeComponents = (milliseconds: number) => {
  const millisecondsInSecond = 1000;
  const millisecondsInMinute = 60 * millisecondsInSecond;
  const millisecondsInHour = 60 * millisecondsInMinute;
  const millisecondsInDay = 24 * millisecondsInHour;

  const days = Math.floor(milliseconds / millisecondsInDay);
  const hours = Math.floor((milliseconds % millisecondsInDay) / millisecondsInHour);
  const minutes = Math.floor((milliseconds % millisecondsInHour) / millisecondsInMinute);
  const seconds = Math.floor((milliseconds % millisecondsInMinute) / millisecondsInSecond);

  return { days, hours, minutes, seconds };
};

export const LandingCountdownTimerClientComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { days, hours, minutes, seconds } = useAotCountdown();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Should not render countdown once AoT has started
  const aotStarted = Date.now() >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  if (!isMounted || aotStarted) {
    // div prevents layout shift in page.tsx
    return <div />;
  }

  return (
    <div className="flex w-48 gap-2">
      {/* ml-32 */}
      <div className="relative w-16 text-right text-5xl font-black dark:text-white">
        {days}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          d
        </div>
      </div>
      <div className="relative w-8 text-right text-3xl font-bold opacity-90 dark:text-white">
        {hours}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          h
        </div>
      </div>
      <div className="relative w-6 text-right text-xl font-semibold opacity-80 blur-[0.5px] dark:text-white">
        {minutes}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          m
        </div>
      </div>
      <div className="animate-pulse-fast relative w-4 text-right text-sm font-medium opacity-70 blur-[1px] dark:text-white">
        {seconds}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          s
        </div>
      </div>
    </div>
  );
};

export const DailyCountdownTimerClientComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { days, hours, minutes, seconds, aotEnded } = useAotCountdown();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  // This will render between when the last challenge is released until one day after
  // This is so that the "that's a wrap" message doesn't show up on the same day of the last challenge
  if (aotEnded) return <></>;

  return (
    <div className="flex w-48 gap-2">
      {/* ml-32 */}
      <div className="relative w-16 text-right text-5xl font-black dark:text-white">
        {days}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          d
        </div>
      </div>
      <div className="relative w-8 text-right text-3xl font-bold opacity-90 dark:text-white">
        {hours}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          h
        </div>
      </div>
      <div className="relative w-6 text-right text-xl font-semibold opacity-80 blur-[0.5px] dark:text-white">
        {minutes}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          m
        </div>
      </div>
      <div className="animate-pulse-fast relative w-4 text-right text-sm font-medium opacity-70 blur-[1px] dark:text-white">
        {seconds}
        <div className="absolute right-0 top-0 -translate-y-full font-mono text-xs font-normal opacity-50">
          s
        </div>
      </div>
    </div>
  );
};
