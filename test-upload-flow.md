# Test Upload Flow

This document is used to test the complete upload-to-reading page flow.

## Expected Behavior

1. User uploads this document
2. Document is processed and lenses are generated
3. Navigation immediately occurs to `/document/{id}`
4. Reading page loads with:
   - Document content in the editor
   - Available lenses (Slide, Study, Story)
   - Functioning lens selector
   - No console errors

## Test Content

This is sample content that should appear in the editor once uploaded.

### Section 1
Some content to test the editor functionality.

### Section 2
More content to verify lens generation works properly.

**This upload should now work without the syntax error!**