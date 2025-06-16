# grasp.now
Transforms any document into different lenses to radically accelerate learning and comprehension.

**Status**: Phase 1 COMPLETED ✅ - Simplified two-page architecture with integrated lens system and clean code structure.

## Current Features

### ✅ Phase 1 COMPLETED
- **Two-Page Architecture**: Clean separation between document management and reading
- **DocumentsPage**: Document upload, organization, and grid view
- **ReadingPage**: Unified Milkdown editor with integrated lens sidebar
- **Lens System**: Dynamic switching between Slide, Study, and Story lenses
- **Rich Text Editor**: Milkdown with WYSIWYG and markdown modes
- **Firebase Integration**: Authentication, storage, and real-time updates
- **Testing Infrastructure**: Comprehensive Playwright e2e test coverage
- **Responsive Design**: Mobile-optimized interface
- **Clean Architecture**: Centralized types, proper component structure

### 🚀 Ready for Phase 2
- Extended lens ecosystem (Scholar, Speed, Custom lenses)
- Real AI integration for content transformation
- Advanced collaboration features

## Quick Start

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Documentation

- **[Phase 1 Plan](docs/phase1.md)** - Complete MVP implementation roadmap
- **[Design System](docs/styles.md)** - UI components and typography
- **[Architecture](docs/architecture.md)** - Technical blueprint
- **[Components](docs/components.md)** - UI component library

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Editor**: Milkdown with rich text editing
- **Design**: NYT-inspired typography system
