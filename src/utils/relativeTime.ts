// in miliseconds
const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  style: 'long',
});

export const getRelativeTime = (date: Date) => {
  const elapsed = date.getTime() - Date.now();

  for (const [unit, ms] of Object.entries(units)) {
    if (Math.abs(elapsed) > ms || unit === 'second') {
      return rtf.format(Math.round(elapsed / ms), unit as Intl.RelativeTimeFormatUnit);
    }
  }
};
