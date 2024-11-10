export function hasAdventStarted(year: number) {
  if (!isValidAdventYear(year)) return false;

  const now = new Date().getTime();
  const aotStartTime = new Date(Date.UTC(year, 11, 1, 5, 0, 0));

  return now >= aotStartTime.getTime();
}

export function getCurrentAdventDay(year: number) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const now = new Date().getTime();
  const startDate = new Date(Date.UTC(year, 11, 1, 5, 0, 0)).getTime();
  const endDate = new Date(Date.UTC(year, 11, 26, 5, 0, 0)).getTime();

  if (now < startDate) {
    return 0; // not advent yet!
  }

  if (now > endDate) {
    return 25;
  }

  const adventDay = Math.floor((now - startDate) / MS_PER_DAY) + 1;

  return adventDay;
}

export function isValidAdventDay(selectedDay: number) {
  return selectedDay >= 1 && selectedDay <= 25;
}

export function isValidAdventYear(selectedYear: number) {
  return selectedYear >= 2023 && selectedYear <= 2024;
}

export const getNextAdventDay = () => {
  const currentDate = new Date();
  const releaseTime = new Date(currentDate);
  releaseTime.setUTCHours(5, 0, 0, 0);

  if (releaseTime.getTime() <= currentDate.getTime()) {
    releaseTime.setUTCDate(releaseTime.getUTCDate() + 1);
  }

  return releaseTime.getTime();
};

export function isAfterJanuaryFirst(year: number) {
  const now = new Date();
  const januaryFirst = new Date(Date.UTC(year + 1, 0, 1, 5, 0, 0));
  return now.getTime() > januaryFirst.getTime();
}

export function isChallengeUnlocked(year: number, day: number): boolean {
  if (!hasAdventStarted(year) || !isValidAdventYear(year) || !isValidAdventDay(day)) {
    return false;
  }

  // Get the current day in the Advent period
  const currentAdventDay = getCurrentAdventDay(year);

  // If the current Advent day is greater than or equal to the challenge day, it’s unlocked
  return currentAdventDay >= day;
}
