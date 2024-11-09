export function hasAdventStarted(year: number) {
  const today = new Date().getTime();
  const aotStartTime = new Date(Date.UTC(year, 11, 1, 5, 0, 0));

  return today >= aotStartTime.getTime();
}

export function getCurrentAdventDay(year: number) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const today = new Date().getTime();
  const startDate = new Date(Date.UTC(year, 11, 1, 5, 0, 0)).getTime();
  const endDate = new Date(Date.UTC(year, 11, 26, 5, 0, 0)).getTime();

  if (today < startDate) {
    return 0; // not advent yet!
  }

  if (today > endDate) {
    return 25;
  }

  const adventDay = Math.floor((today - startDate) / MS_PER_DAY) + 1;

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
