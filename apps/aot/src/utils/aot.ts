export function daysAfterDecemberFirst(year: string) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const startDate = new Date(`${year}-11-01T05:00:00.000Z`).getTime();
  const today = Date.now();

  const daysPassed = Math.floor((today - startDate) / MS_PER_DAY) + 1;

  return daysPassed;
}

export function isAfterJanuaryFirst(year: number) {
  // Define Eastern timezone offset (EST is UTC-5; during daylight savings, EDT is UTC-4)
  const easternTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const currentEasternDate = new Date(easternTime);

  // Define January 1st of the provided year in Eastern Time
  const januaryFirst = new Date(Date.UTC(year + 1, 0, 1));
  const januaryFirstEastern = new Date(
    januaryFirst.toLocaleString('en-US', { timeZone: 'America/New_York' }),
  );

  console.log(currentEasternDate > januaryFirstEastern);
  return currentEasternDate > januaryFirstEastern;
}
