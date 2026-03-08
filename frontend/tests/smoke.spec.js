import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Explore|Home/i).first()).toBeVisible();
});

test('explore page loads', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByText(/Explore Courses|Search courses/i).first()).toBeVisible();
});

// Requires test credentials + seeded data in CI environment.
test.skip('auth + purchase + admin upload/edit smoke flow', async () => {
  // Intentionally skipped until CI secrets/users are configured.
});
