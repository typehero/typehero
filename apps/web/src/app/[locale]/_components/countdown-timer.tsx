'use client';
import { useEffect, useState } from 'react';

export const CountdownTimer = () => {
  const releaseDate = new Date('2023-12-01T05:00:00.000Z');
  const [timeDifference, setTime] = useState(releaseDate.getTime() - Date.now());

  useEffect(() => {
    const countdown = () => {
      setTime((prevTime) => {
        return Math.max(0, prevTime - 100);
      });
    };

    const timerId = setInterval(countdown, 100);

    return () => {
      clearInterval(timerId);
    };
  }, [timeDifference]);

  const { days, hours, minutes, seconds } = calculateTimeComponents(timeDifference);

  return <>{`${days}, ${hours}, ${minutes}, ${seconds}`}</>;
};

const calculateTimeComponents = (milliseconds: number, isFormatted: boolean = false) => {
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
