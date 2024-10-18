import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';

export const getRelativeTimeStrict = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date);
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
  });
};

export const getRelativeTime = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date);
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};
