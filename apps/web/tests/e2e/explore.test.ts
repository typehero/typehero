import { test, expect } from '@playwright/test';

test('explore page', async ({ page }) => {
  await page.goto('/explore');

  await expect(page.getByRole('heading', { name: 'TypeHero Explore' })).toBeVisible();
});
