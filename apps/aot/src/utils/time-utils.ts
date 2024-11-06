export function getCurrentAdventDay() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const today = Date.now();
  const startDate = new Date('2024-12-01T05:00:00.000Z').getTime();

  if (today < startDate) {
    return 0; // not advent yet!
  }

  const adventDay = Math.floor((today - startDate) / MS_PER_DAY) + 1;

  return adventDay;
}

export function isValidAdventDay(selectedDay: number) {
  if (selectedDay < 1 || selectedDay > 25) return false;

  const currentAdventDay = getCurrentAdventDay();
  return selectedDay <= currentAdventDay;
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
