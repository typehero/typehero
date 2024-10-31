'use client';

import { useEffect, useState } from 'react';

export const useCountdown = () => {
  const [releaseDate, setReleaseDate] = useState(() => calculateNextReleaseTime());
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDate.getTime() - Date.now()),
  );

  useEffect(() => {
    const countdown = () => {
      const aotEndTime = new Date(Date.UTC(2024, 11, 26, 5, 0, 0));
      if (Date.now() > aotEndTime.getTime()) {
        setRemainingTime(0);
        return;
      }

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
  }, [remainingTime, releaseDate]);
  return calculateTimeComponents(remainingTime);
};

const calculateNextReleaseTime = () => {
  const currentDate = new Date();
  const releaseTime = new Date(currentDate);
  releaseTime.setUTCHours(5, 0, 0, 0);

  const decemberFirstReleaseTime = new Date(Date.UTC(currentDate.getUTCFullYear(), 11, 1, 5, 0, 0));

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
  const [isMounted, setIsMounted] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or return a skeleton/placeholder
  }

  return (
    <>
      <div className="mx-auto flex gap-2">
        <div className="grid h-full w-full place-items-center text-4xl font-black dark:text-white">
          {days}
        </div>
        <div className="grid h-full w-full place-items-center text-3xl font-black dark:text-white">
          {hours}
        </div>
        <div className="grid h-full w-full place-items-center text-2xl font-black dark:text-white">
          {minutes}
        </div>
        <div className="grid h-full w-full animate-pulse place-items-center text-xl font-black dark:text-white">
          {seconds}
        </div>
      </div>
    </>
  );
};
