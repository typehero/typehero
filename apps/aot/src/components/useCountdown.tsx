'use client';

import { useEffect, useState } from 'react';

export const useAotCountdown = () => {
  const [releaseDate, setReleaseDate] = useState(() => calculateNextReleaseTime());
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDate.getTime() - Date.now()),
  );

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
      }
    };

    const timerId = setInterval(countdown, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [releaseDate]);

  return calculateTimeComponents(remainingTime);
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

export const CountdownTimer = () => {
  // 05:00AM Jan 1, 2025 (UTC) <-> 00:00AM Jan 1, 2025 (EST)
  const [isMounted, setIsMounted] = useState(false);
  const { days, hours, minutes, seconds } = useAotCountdown();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div />;
  }

  // After holiday ends
  const holidayEnd = new Date(Date.UTC(2025, 0, 1, 5, 0, 0));
  if (Date.now() > holidayEnd.getTime()) {
    return (
      <>
        <p className="text-center text-xl font-semibold">Thats a wrap!</p>
      </>
    );
  }

  // This will be true between 05:00AM Dec 25, 2024 (UTC) and 05:00AM Jan 1, 2025 (UTC)
  //
  // Make sure to adjust UI for this being gone!
  const isCountdownComplete = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  if (isCountdownComplete) {
    return null;
  }

  return (
    <div className="flex w-48 gap-2">
      {/* ml-32 */}
      <div className="text-5xl font-black dark:text-white">{days}</div>
      <div className="text-3xl font-bold opacity-90 dark:text-white">{hours}</div>
      <div className="text-xl font-semibold opacity-80 blur-[0.5px] dark:text-white">{minutes}</div>
      <div className="animate-pulse-fast text-sm font-medium opacity-70 blur-[1px] dark:text-white">
        {seconds}
      </div>
    </div>
  );
};
