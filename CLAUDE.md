# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**grasp.now** is a document transformation and learning platform that transforms documents through multiple "lenses" - different perspectives optimized for various comprehension needs. 

**Current Status**: Phase 1 Days 1-10 complete. Reading page layout implemented with DocumentEditor and LensSelector components. Testing infrastructure complete with Playwright e2e tests.

## Technology Stack

### Frontend (Planned)
- React with TypeScript
- Vite for build tooling
- Zustand for state management
- Milkdown for rich text editing
- Tailwind CSS for styling
- NYT-inspired typography and design system

### Backend (Planned)
- Firebase (Auth, Firestore, Cloud Storage)
- Google Cloud Platform (Cloud Functions, Pub/Sub, Cloud Run)
- Google AI (Gemini 1.5 Pro) for document transformations

## Architecture

Event-driven serverless architecture:
```
User Upload → Cloud Storage → Cloud Function (extract text) 
→ Pub/Sub Queue → Cloud Run Job (generate lenses) 
→ Firestore → Real-time UI updates
```

## Core Concepts

### Lenses
Document transformations that present content in different ways:
- **Slide Lens**: Presentation-ready key concepts
- **Study Lens**: Detailed notes with examples  
- **Story Lens**: Narrative, magazine-style format
- **Scholar Lens**: Academic formatting with citations
- **Speed Lens**: Executive summaries
- **Custom Lenses**: User-defined transformations

### Key Features (MVP)
- Multi-format document upload (PDF, DOCX, TXT, MD)
- Automatic generation of 3 core lenses per document
- Real-time lens switching with position sync
- Dynamic focus control (detail granularity)
- Citation transparency system

## Development Commands

### Frontend (React/Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Type check (manual)
npx tsc --noEmit

# Run end-to-end tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug
```

### Backend (Firebase/GCP)
```bash
# Deploy Firebase functions
firebase deploy --only functions

# Deploy to Cloud Run
gcloud run deploy

# Run local Firebase emulators
firebase emulators:start
```

## Project Structure

```
grasp-now/
├── CLAUDE.md             # Project instructions for Claude Code
├── README.md             # Project overview
├── docs/                 # Product documentation
│   ├── phase1.md         # Current MVP implementation plan
│   ├── styles.md         # Design system
│   ├── architecture.md   # Technical blueprint
│   ├── plan.md           # Phased roadmap
│   ├── product.md        # Product vision
│   ├── user-stories.md   # Feature requirements
│   └── components.md     # UI component library
└── frontend/             # React application
    ├── src/
    │   ├── components/   # React components
    │   │   ├── ui/       # Base UI components
    │   │   ├── layout/   # Layout components
    │   │   └── reading/  # Reading page components (NEW)
    │   ├── pages/        # Route components (NEW)
    │   ├── store/        # Zustand stores
    │   ├── lib/          # Utilities, Firebase config, and lens service
    │   ├── hooks/        # Custom React hooks (useLens)
    │   ├── types.ts      # TypeScript definitions (NEW)
    │   └── assets/       # Static assets
    ├── tests/            # Playwright e2e tests (NEW)
    │   ├── fixtures/     # Test data and files
    │   ├── user-authentication.spec.ts
    │   ├── document-upload.spec.ts
    │   ├── document-management.spec.ts
    │   ├── document-editing.spec.ts
    │   └── responsive-design.spec.ts
    ├── public/           # Public assets
    ├── package.json      # Dependencies and scripts
    ├── playwright.config.ts # Playwright configuration (NEW)
    ├── vite.config.ts    # Vite configuration
    ├── tailwind.config.js # Tailwind CSS config
    └── tsconfig.json     # TypeScript configuration
```

## Current Development Phase

**🚀 Currently in Phase 1: MVP Implementation (4-week sprint)**

Implementation follows `docs/phase1.md`:
- ✅ React 18 + Vite + TypeScript + Firebase setup complete
- ✅ Google authentication with Zustand state management  
- ✅ Basic UI framework with Tailwind CSS
- ✅ Document upload/management complete
- ✅ Reading page layout with split-view design and lens selector
- ✅ End-to-end testing infrastructure with Playwright
- ✅ GitHub Actions CI/CD pipeline for automated testing
- ✅ Milkdown editor fully integrated with rich text editing
- ✅ Dynamic lens system with proper state management
- ✅ Lens content generation and switching functionality

## Implementation Priorities

When implementing, follow the 4-phase roadmap:

1. **Phase 1 (Weeks 1-4)**: Core Lens Engine ← CURRENT PHASE
   - Document upload and text extraction
   - AI-powered lens generation (Slide, Study, Story)
   - Real-time viewer with lens switching
   - Citation transparency system

2. **Phase 2 (Weeks 5-8)**: Lens Ecosystem  
   - Scholar and Speed lenses
   - Custom lens creation
   - Focus control slider

3. **Phase 3 (Weeks 9-12)**: Collaboration
   - Sharing and permissions
   - Version history
   - Export functionality

4. **Phase 4 (Months 4-6)**: Intelligence
   - Learning analytics
   - Smart recommendations
   - Advanced AI features

## Key Technical Decisions

- Use Firestore for real-time updates and offline support
- Implement parallel lens generation for performance
- Store extracted text separately from generated lenses
- Use Cloud Storage signed URLs for document security
- Implement position sync using percentage-based markers
- Cache frequently accessed lenses for cost optimization
- NYT-inspired design with monochromatic color scheme (black/white/gray)
- Clean, minimal UI inspired by Craft.do and Linear.app layouts

## Security Considerations

- Implement row-level security in Firestore
- Use Firebase Auth for user authentication
- Validate file uploads (type, size, content)
- Sanitize user inputs for custom lens prompts
- Use Cloud Storage lifecycle rules for data retention

## Testing Infrastructure

### End-to-End Testing with Playwright

The project includes comprehensive e2e testing infrastructure covering user workflows:

**Test Coverage:**
- **Authentication Flow**: Login/logout, session management
- **Document Upload**: File validation, drag-and-drop, progress tracking  
- **Document Management**: Grid view, folder organization, navigation
- **Document Reading**: Document viewing, lens switching (when implemented)
- **Responsive Design**: Mobile, tablet, desktop layouts

**Running Tests:**
```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui

# Debug individual tests
npm run test:e2e:debug
```

**Test Configuration:**
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile and desktop viewports
- Automatic dev server startup
- Screenshot/video capture on failures
- GitHub Actions CI/CD integration

**Key Features:**
- Tests focus on user journeys, not implementation details
- Mock authentication state with Zustand store patterns
- Use actual document data from documentStore mock
- Responsive design validation across breakpoints
- Error handling and edge case coverage

## Documentation Reference

Quick guide to project docs:

- **`docs/phase1.md`** - Complete MVP implementation plan with mock lens generation (CURRENT)
- **`docs/styles.md`** - Complete design system with colors, typography, animations, and component patterns
- **`docs/architecture.md`** - Technical blueprint, Firebase/GCP setup, AI pipeline  
- **`docs/plan.md`** - Phased roadmap from steel thread to full platform
- **`docs/product.md`** - Product vision, features, and UI concepts
- **`docs/user-stories.md`** - Feature requirements and acceptance criteria
- **`docs/components.md`** - UI component library with NYT-inspired design system

## Memory Log & Current Status
- Phase 1 Days 1-14 complete: Core UI, document management, reading page with Milkdown integration
- Milkdown editor fully integrated with rich text editing capabilities
- Dynamic lens system implemented with proper state management (LensService, useLens hook)
- Clean architecture: Document → useLens hook → DocumentEditor/LensSelector components
- End-to-end testing infrastructure complete with Playwright
- **NEXT PRIORITY**: Phase 1 completion and polish - optimize performance, add remaining features
- **KEY FILES**: `/src/lib/lensService.ts`, `/src/hooks/useLens.ts`, `/src/pages/ReadingPage.tsx`
- Remember to look at online source documentation for packages/framework you're not familiar with

## Recently Completed:
1. ✅ Integrated Milkdown editor with full WYSIWYG functionality  
2. ✅ Implemented dynamic lens content generation and switching
3. ✅ Created proper state management with useLens hook
4. ✅ Refactored reading page for clean, maintainable architecture
5. ✅ Added comprehensive error handling and loading states
