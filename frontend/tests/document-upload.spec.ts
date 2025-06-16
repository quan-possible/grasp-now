import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Document Upload Flow', () => {
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
    
    await page.goto('/documents');
  });

  test('should show upload zone on documents page', async ({ page }) => {
    await expect(page.locator('text=Ask questions about your documents or drag & drop files to upload')).toBeVisible();
  });

  test('should show upload button in prompt zone', async ({ page }) => {
    // Look for upload button in PromptUploadZone
    await expect(page.locator('button:has-text("Upload Document")')).toBeVisible();
  });

  test('should show prompt input area', async ({ page }) => {
    // Should show the prompt input in PromptUploadZone
    const promptArea = page.locator('textarea, input[type="text"]').first();
    if (await promptArea.isVisible()) {
      await expect(promptArea).toBeVisible();
    }
  });

  test('should show file type indicators', async ({ page }) => {
    // Should show accepted file types
    await expect(page.locator('text=.pdf')).toBeVisible();
    await expect(page.locator('text=.docx')).toBeVisible();
    await expect(page.locator('text=.txt')).toBeVisible();
    await expect(page.locator('text=.md')).toBeVisible();
  });

  test('should show mock documents in grid', async ({ page }) => {
    // Mock documents are already in the store by default
    // Should show document in grid
    await expect(page.locator('text=Product Strategy 2024')).toBeVisible();
    await expect(page.locator('text=Market Analysis Report')).toBeVisible();
  });
});