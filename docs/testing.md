# Testing Guide

## Overview

The grasp.now frontend includes comprehensive end-to-end testing infrastructure using Playwright. Tests focus on user workflows and real-world usage scenarios rather than implementation details.

## Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (includes Playwright)
npm install

# Run all tests (headless)
npm run test:e2e

# Run tests with interactive UI (recommended for development)
npm run test:e2e:ui

# Debug specific tests
npm run test:e2e:debug
```

## Test Coverage

### 1. Authentication Flow (`user-authentication.spec.ts`)
- Login page display and functionality
- Successful authentication with Google
- User profile display in navigation
- Logout functionality and redirect

### 2. Document Upload (`document-upload.spec.ts`)
- Upload zone visibility and functionality
- File type validation
- Progress tracking and feedback
- Integration with PromptUploadZone component

### 3. Document Management (`document-management.spec.ts`)
- Document grid display
- Folder organization in sidebar
- Document navigation and routing
- User welcome messages and layout

### 4. Document Reading (`document-editing.spec.ts`)
- Document reading page functionality
- Route handling for document IDs
- Authentication requirements
- Navigation between documents and main page

### 5. Responsive Design (`responsive-design.spec.ts`)
- Mobile layout (375px width)
- Tablet layout (768px width) 
- Desktop layout (1920px width)
- Touch-friendly interface elements
- Keyboard navigation support

## Test Configuration

### Browsers
- **Chrome**: Primary testing browser
- **Firefox**: Cross-browser compatibility
- **Safari/Webkit**: macOS compatibility
- **Mobile Chrome**: Mobile experience (Pixel 5)
- **Mobile Safari**: iOS experience (iPhone 12)

### Viewports
- **Mobile**: 375x667 (iPhone SE)
- **Mobile Landscape**: 667x375
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1920x1080
- **Small Mobile**: 320x568 (iPhone 5)

### Features
- **Auto-start dev server**: Tests automatically start Vite dev server
- **Screenshot on failure**: Automatic capture for debugging
- **Video recording**: On test failures
- **Multi-browser parallel execution**: Faster test runs
- **CI/CD integration**: GitHub Actions workflow

## Writing Tests

### Best Practices

1. **Focus on user journeys**, not implementation details
2. **Use semantic selectors** when possible (text content, roles)
3. **Avoid brittle selectors** like CSS classes or data-testid
4. **Test real user workflows** end-to-end
5. **Mock external dependencies** (Firebase auth, API calls)

### Authentication Mocking

Tests use Zustand store state mocking for authentication:

```typescript
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
```

### Document Data

Tests use the existing mock documents from `documentStore.ts`:
- "Product Strategy 2024" 
- "Market Analysis Report"

This ensures tests align with actual application data structure.

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/playwright.yml` workflow:
- Runs on push to `main` and `phase-1-setup` branches
- Runs on pull requests to `main`
- Tests across Ubuntu environment
- Uploads test reports as artifacts
- Retains reports for 30 days

### Workflow Steps
1. Checkout code
2. Set up Node.js LTS
3. Install dependencies
4. Install Playwright browsers
5. Run all test suites
6. Upload failure artifacts

## Debugging Tests

### Interactive UI Mode
```bash
npm run test:e2e:ui
```
- Visual test runner
- Step-through debugging
- Real-time browser interaction
- Network traffic inspection

### Debug Mode
```bash
npm run test:e2e:debug
```
- Opens browser with dev tools
- Pauses execution for inspection
- Console output visible
- Step-by-step execution

### Common Issues

1. **Timing Issues**: Use `await expect().toBeVisible()` instead of delays
2. **Element Not Found**: Check if element actually exists in current implementation
3. **Authentication Failures**: Verify Zustand store mocking is correct
4. **Route Issues**: Ensure routes match App.tsx configuration

## Test Maintenance

### When to Update Tests

- **New features added**: Add corresponding test coverage
- **UI changes**: Update selectors and expectations
- **Route changes**: Update navigation tests
- **Authentication changes**: Update auth mocking strategy

### Adding New Tests

1. Create new `.spec.ts` file in `/tests` directory
2. Follow existing patterns for authentication mocking
3. Use real document data from store
4. Focus on user workflows
5. Add to CI/CD if needed

## Performance Considerations

- Tests run in parallel by default
- Use `fullyParallel: true` in config
- Limit to 1 worker in CI for stability
- Browser reuse between tests when possible
- Automatic cleanup after test completion

## Future Enhancements

- **Visual regression testing**: Screenshot comparison
- **Performance testing**: Load time and interaction metrics
- **Accessibility testing**: Automated a11y checks
- **API testing**: Backend integration tests
- **Cross-device testing**: Real device cloud integration