export function daysAfterDecemberFirst() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const startDate = new Date('2023-12-01T05:00:00.000Z').getTime();
  const today = Date.now();

  const daysPassed = Math.floor((today - startDate) / MS_PER_DAY);

  return daysPassed;
}
