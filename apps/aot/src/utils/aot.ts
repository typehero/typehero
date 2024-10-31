export function daysAfterDecemberFirst(year: string) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const startDate = new Date(`${year}-12-01T05:00:00.000Z`).getTime();
  const today = Date.now();

  const daysPassed = Math.floor((today - startDate) / MS_PER_DAY) + 1;

  return daysPassed;
}
