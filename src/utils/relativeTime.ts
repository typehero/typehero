import { formatDistanceToNow } from 'date-fns';

export const getRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};
