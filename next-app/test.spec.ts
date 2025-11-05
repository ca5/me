import { test, expect } from '@playwright/test';

test('no-op', async ({ page }) => {
  expect(true).toBe(true);
});
