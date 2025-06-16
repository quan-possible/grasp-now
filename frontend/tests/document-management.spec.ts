import { test, expect } from '@playwright/test';

test.describe('Document Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state - documents are already in the store by default
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
    
    await page.goto('/documents');
  });

  test('should display documents in grid layout', async ({ page }) => {
    // Should show mock document cards
    await expect(page.locator('text=Product Strategy 2024')).toBeVisible();
    await expect(page.locator('text=Market Analysis Report')).toBeVisible();
  });

  test('should show folder organization in sidebar', async ({ page }) => {
    // Should show mock folder structure
    await expect(page.locator('text=Strategy')).toBeVisible();
    await expect(page.locator('text=Research')).toBeVisible();
    await expect(page.locator('text=Personal')).toBeVisible();
  });

  test('should open document for editing when clicked', async ({ page }) => {
    // Click on a document
    await page.click('text=Product Strategy 2024');
    
    // Should navigate to reading page (correct route is /document/:id)
    await expect(page).toHaveURL(/\/document\/1/);
  });

  test('should show document cards with basic info', async ({ page }) => {
    // Should show document titles and basic info
    await expect(page.locator('text=Product Strategy 2024')).toBeVisible();
    await expect(page.locator('text=Market Analysis Report')).toBeVisible();
    // Note: Document actions on hover not implemented yet
  });

  test('should show recent documents section', async ({ page }) => {
    // Should show section header
    await expect(page.locator('text=Recent Documents')).toBeVisible();
    await expect(page.locator('button:has-text("View All")')).toBeVisible();
  });

  test('should show getting started section', async ({ page }) => {
    // Should show phase 1 completion message
    await expect(page.locator('text=Phase 1 MVP Implementation Complete')).toBeVisible();
    await expect(page.locator('button:has-text("Upload Document")')).toBeVisible();
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
  });

  test('should show user welcome message', async ({ page }) => {
    // Should show personalized greeting
    await expect(page.locator('text=Good afternoon, Test')).toBeVisible();
    await expect(page.locator('text=Transform your documents with intelligent lenses')).toBeVisible();
  });

  test('should show sidebar navigation', async ({ page }) => {
    // Should show navigation sidebar
    await expect(page.locator('text=Strategy')).toBeVisible();
    await expect(page.locator('text=Research')).toBeVisible();
    await expect(page.locator('text=Personal')).toBeVisible();
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should show mobile-optimized layout
    const documentGrid = page.locator('[data-testid="document-grid"]');
    await expect(documentGrid).toHaveClass(/mobile/);
    
    // Sidebar should be collapsed on mobile
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toHaveClass(/collapsed/);
  });
});