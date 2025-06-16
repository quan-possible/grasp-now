# Test Fixtures

This directory contains test files and data used by Playwright tests.

## File Types

- `sample-document.pdf` - Small PDF for upload testing
- `sample-document.docx` - Word document for upload testing  
- `sample-document.txt` - Plain text file for upload testing
- `large-file.txt` - File exceeding size limits for validation testing

## Usage

These fixtures are referenced in test files using relative paths:

```typescript
const testFile = path.join(__dirname, 'fixtures', 'sample-document.pdf');
```

## Adding New Fixtures

When adding new test files:
1. Keep files small (< 1MB) for fast test execution
2. Use realistic content that matches expected user uploads
3. Include various file formats supported by the application
4. Add edge cases (empty files, malformed files) for error testing