'use client';
import { useEffect, useState } from 'react';

export const CountdownTimer = () => {
  const releaseDateTimeInMilliSeconds = new Date('2023-12-01T05:00:00.000Z').getTime();
  const [remainingTime, setRemainingTime] = useState(
    Math.max(0, releaseDateTimeInMilliSeconds - Date.now()),
  );

  useEffect(() => {
    const countdown = () => {
      const newRemainingTime = Math.max(0, releaseDateTimeInMilliSeconds - Date.now());
      setRemainingTime(newRemainingTime);
    };

    const timerId = setInterval(countdown, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [remainingTime, releaseDateTimeInMilliSeconds]);

  const { days, hours, minutes, seconds } = calculateTimeComponents(remainingTime);

  return <>{`${days}, ${hours}, ${minutes}, ${seconds}`}</>;
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
