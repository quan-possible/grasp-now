import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should see login page
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
    await expect(page.locator('text=Sign in to grasp.now')).toBeVisible();
  });

  test('should navigate to documents page after login', async ({ page }) => {
    // Mock successful authentication by setting Zustand store state
    await page.addInitScript(() => {
      // Mock Firebase User object in Zustand store
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
    
    await page.goto('/');
    
    // Should redirect to documents page
    await expect(page).toHaveURL('/documents');
    await expect(page.locator('text=grasp.now')).toBeVisible();
  });

  test('should show user profile in navigation', async ({ page }) => {
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
    
    // Should show user info in header
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

  test('should logout and redirect to login page', async ({ page }) => {
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
    
    // Click sign out button
    await page.click('button:has-text("Sign Out")');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
  });
});