export function getCurrentAdventDay() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // Midnight EST
  // const startDate = new Date('2024-12-01T05:00:00.000Z').getTime();

  // Midnight EDT
  const today = Date.now();
  const startDate = new Date('2024-10-01T04:00:00.000Z').getTime();

  if (today < startDate) {
    return 0; // not advent yet!
  }

  const adventDay = Math.floor((today - startDate) / MS_PER_DAY) + 1;

  return adventDay;
}

function isValidAdventDay(value: number) {
  return value >= 1 && value <= 25;
}

export function validateAdventDay(selectedDay: number) {
  if (!isValidAdventDay(selectedDay)) return undefined;

  const currentAdventDay = getCurrentAdventDay();
  return selectedDay <= currentAdventDay ? currentAdventDay : undefined;
}
