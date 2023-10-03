import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/unauthenticated.json' });

test('explore page', async ({ page }) => {
  await page.goto('/explore');

  await expect(page.getByRole('heading', { name: 'Explore' })).toBeVisible();
});
