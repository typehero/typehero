import { describe, it, expect } from 'vitest';

// Copy of AOT_CHALLENGES for testing
const AOT_CHALLENGES = ['2023-6', '2023-25', '2024-1'];

function getSolutionHref(slug: string, solutionId: number): string {
  if (AOT_CHALLENGES.includes(slug)) {
    const [year, day] = slug.split('-');
    return `https://adventofts.com/events/${year}/${day}/solutions/${solutionId}`;
  }
  return `/challenge/${encodeURIComponent(slug)}/solutions/${solutionId}`;
}

describe('getSolutionHref', () => {
  it('should return adventofts URL for AOT 2023 challenges', () => {
    expect(getSolutionHref('2023-6', 2924)).toBe(
      'https://adventofts.com/events/2023/6/solutions/2924'
    );
    expect(getSolutionHref('2023-25', 100)).toBe(
      'https://adventofts.com/events/2023/25/solutions/100'
    );
  });

  it('should return adventofts URL for AOT 2024 challenges', () => {
    expect(getSolutionHref('2024-1', 500)).toBe(
      'https://adventofts.com/events/2024/1/solutions/500'
    );
  });

  it('should return typehero URL for regular challenges', () => {
    expect(getSolutionHref('pick', 123)).toBe('/challenge/pick/solutions/123');
    expect(getSolutionHref('awaited', 456)).toBe('/challenge/awaited/solutions/456');
  });

  it('should handle slugs with special characters', () => {
    expect(getSolutionHref('my-challenge', 789)).toBe('/challenge/my-challenge/solutions/789');
  });
});
