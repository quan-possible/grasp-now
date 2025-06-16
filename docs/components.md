# Component Library

## Reading Page Components

### DocumentEditor
- Integrates Milkdown for rich text editing
- Handles lens content dynamically
- Key-based re-rendering on lens changes

### LensSelector  
- Dynamic lens cards with preview content
- Uses LensService for lens definitions
- Proper state management integration

### DocumentHeader
- Formatting toolbar for editor
- Responsive design

## Services & Hooks

### LensService
- Centralized lens definitions and content generation
- Type-safe lens management
- Extensible for Phase 2

### useLens Hook
- State management for lens operations
- Content caching and synchronization
- Clean API for components

Updated architecture provides clean separation of concerns and maintainable code structure.