import { formatDistanceToNow } from 'date-fns';

export const getRelativeTime = (date: Date | string) => {
  if (typeof date === 'string') date = new Date(date);
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};