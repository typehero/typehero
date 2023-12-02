'use client';
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
  const releaseDateTimeInMilliSeconds = useMemo(() => {
    const date = new Date();
    date.setUTCHours(5, 0, 0, 0);
    return date;
  }, []);

  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDateTimeInMilliSeconds - Date.now()),
  );

  useEffect(() => {
    const countdown = () => {
      const newRemainingTime = Math.max(0, releaseDateTimeInMilliSeconds.getTime() - Date.now());
      setRemainingTime(newRemainingTime);

      if (newRemainingTime === 0) {
        const nextReleaseDateTime = new Date();
        nextReleaseDateTime.setUTCHours(5, 0, 0, 0);
        nextReleaseDateTime.setDate(nextReleaseDateTime.getDate() + 1);

        setRemainingTime(nextReleaseDateTime.getTime() - Date.now());
      }
    };

    const timerId = setInterval(countdown, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [remainingTime, releaseDateTimeInMilliSeconds]);

  const { days, hours, minutes, seconds } = calculateTimeComponents(remainingTime);

  if (remainingTime === 0) return null;

  return (
    <div className="flex gap-4 font-bold tabular-nums">
      <DateCard date={days} label="Days" />
      <DateCard date={hours} label="Hours" />
      <DateCard date={minutes} label="Minutes" />
      <DateCard date={seconds} label="Seconds" />
    </div>
  );
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
