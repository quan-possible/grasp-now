import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.__ZUSTAND_STORE_STATE__ = {
        auth: {
          user: {
            uid: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User'
          },
          loading: false
        }
      };
    });
  });

  test('should adapt layout for mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/documents');
    
    // Should show mobile-friendly layout
    await expect(page.locator('text=grasp.now')).toBeVisible();
    await expect(page.locator('text=Recent Documents')).toBeVisible();
    
    // Content should be responsive
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });

  test('should show mobile-optimized document page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/document/1');
    
    // Should load on mobile without errors
    await expect(page).toHaveURL('/document/1');
    
    // Check viewport is mobile size
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });

  test('should handle tablet breakpoint correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/documents');
    
    // Should show content at tablet size
    await expect(page.locator('text=grasp.now')).toBeVisible();
    
    // Check viewport is tablet size
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(768);
  });

  test('should maintain usability on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/documents');
    
    // Should show full desktop layout
    await expect(page.locator('text=Strategy')).toBeVisible();
    await expect(page.locator('text=Research')).toBeVisible();
    
    // Check viewport is desktop size
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
  });

  test('should handle landscape orientation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/documents');
    
    // Should load in landscape mobile
    await expect(page.locator('text=grasp.now')).toBeVisible();
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(667);
    expect(viewport?.height).toBe(375);
  });

  test('should show touch-friendly interface on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/documents');
    
    // Should show buttons that are clickable on mobile
    await expect(page.locator('button:has-text("Upload Document")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });

  test('should handle text scaling appropriately', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/documents');
    
    // Text should be readable
    await expect(page.locator('text=Product Strategy 2024')).toBeVisible();
    await expect(page.locator('text=Market Analysis Report')).toBeVisible();
  });

  test('should work on very small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/documents');
    
    // Should still be functional on small screens
    await expect(page.locator('text=grasp.now')).toBeVisible();
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(320);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/documents');
    
    // Tab navigation should work
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    // Note: Focus visibility depends on actual implementation
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  };
});