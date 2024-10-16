export function getCurrentAdventDay() {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // Midnight EST
  // const startDate = new Date('2024-12-01T05:00:00.000Z').getTime();

  // Midnight EDT
  const today = Date.now();
  const startDate = new Date('2024-10-01T04:00:00.000Z').getTime();

  if (today < startDate) {
    return 0; // advent hasn't started yet!!
  }

  const adventDay = Math.floor((today - startDate) / MS_PER_DAY) + 1;

  return adventDay;
}

// prettier-ignore
export type AdventDay = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
            11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
            19 | 20 | 21 | 22 | 23 | 24 | 25;

function isAdventDay(value: number): value is AdventDay {
  return value >= 1 && value <= 25;
}

export function validateAdventDay(routeDay: unknown) {
  const currentDay = Number(routeDay);
  if (!isAdventDay(currentDay)) return undefined;
  const currentAdventDay = getCurrentAdventDay();
  return currentDay <= currentAdventDay ? currentAdventDay : undefined;
}
