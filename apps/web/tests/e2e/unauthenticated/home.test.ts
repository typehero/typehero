import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/unauthenticated.json' });

test('home page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'type hero' })).toBeVisible();
});
