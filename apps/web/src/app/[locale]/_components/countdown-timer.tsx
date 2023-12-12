'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DateCard = ({ date, label }: { date: React.ReactNode; label: string }) => {
  return (
    <div className="flex select-none flex-col items-center gap-4">
      <div className="flex aspect-square w-[60px] items-center justify-center rounded-xl border bg-white/90 p-2 text-3xl text-red-600 lg:w-[80px] lg:text-4xl">
        {date}
      </div>
      <span className="text-foreground text-sm">{label}</span>
    </div>
  );
};

export const CountdownTimer = () => {
  const router = useRouter();
  const [releaseDate, setReleaseDate] = useState(() => {
    return calculateNextReleaseTime();
  });

  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDate.getTime() - Date.now()),
  );

  useEffect(() => {
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
  }, [remainingTime, releaseDate, router]);

  const { days, hours, minutes, seconds } = calculateTimeComponents(remainingTime);

  if (remainingTime === 0) return null;

  return (
    <>
      <p className="text-center text-xl font-semibold">
        The next type challenge will unlock at <span className="text-primary">midnight(est)</span>{' '}
        on December {formatNumberWithSuffix(Math.min(releaseDate.getUTCDate(), 25))}
      </p>
      <div className="flex gap-4 font-bold tabular-nums">
        <DateCard date={days} label="Days" />
        <DateCard date={hours} label="Hours" />
        <DateCard date={minutes} label="Minutes" />
        <DateCard date={seconds} label="Seconds" />
      </div>
    </>
  );
};

const calculateNextReleaseTime = () => {
  const currentDate = new Date();
  const releaseTime = new Date(currentDate);
  releaseTime.setUTCHours(5, 0, 0, 0);

  if (releaseTime.getUTCHours() <= currentDate.getUTCHours()) {
    releaseTime.setUTCDate(releaseTime.getUTCDate() + 1);
  }

  return releaseTime;
};

const formatNumberWithSuffix = (n: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const lastDigit = n % 10;
  const isSpecialCase = n >= 11 && n <= 13;
  const suffix = isSpecialCase ? 'th' : suffixes[lastDigit] || 'th';

  return `${n}${suffix}`;
};

const calculateTimeComponents = (milliseconds: number, isFormatted = false) => {
  const millisecondsInSecond = 1000;
  const millisecondsInMinute = 60 * millisecondsInSecond;
  const millisecondsInHour = 60 * millisecondsInMinute;
  const millisecondsInDay = 24 * millisecondsInHour;

  const days = Math.floor(milliseconds / millisecondsInDay);
  const hours = Math.floor((milliseconds % millisecondsInDay) / millisecondsInHour);
  const minutes = Math.floor((milliseconds % millisecondsInHour) / millisecondsInMinute);
  const seconds = Math.floor((milliseconds % millisecondsInMinute) / millisecondsInSecond);

  const formatPlural = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const timeDuration = isFormatted
    ? {
        days: formatPlural(days, 'day'),
        hours: formatPlural(hours, 'hour'),
        minutes: formatPlural(minutes, 'minute'),
        seconds: formatPlural(seconds, 'second'),
      }
    : {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      };

  return timeDuration;
};
