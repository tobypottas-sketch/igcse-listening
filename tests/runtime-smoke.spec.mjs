import { test, expect } from '@playwright/test';

test('Listening boots and renders Exercise 1 without browser errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText('Exercise 1');
  await expect(page.locator('body')).toContainText('What do the teenagers decide to buy for their mother?');
  expect(pageErrors).toEqual([]);
});
