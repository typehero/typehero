import { formatDistanceToNowStrict } from 'date-fns';

export const getRelativeTime = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date);
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
  });
};