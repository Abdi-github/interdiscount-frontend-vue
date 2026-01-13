import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/de');
    await expect(page).toHaveTitle(/Interdiscount/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/de');
    await expect(page.getByTestId('hero-section')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/de');
    await page.getByTestId('nav-products').click();
    await expect(page).toHaveURL(/\/de\/products/);
  });
});
