# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**grasp.now** is a document transformation and learning platform that transforms documents through multiple "lenses" - different perspectives optimized for various comprehension needs. Currently in planning phase with no implementation code yet.

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

Since this project has no implementation yet, here are the expected commands once set up:

### Frontend (React/Vite)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
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

## Project Structure (Planned)

```
grasp-now/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and Firebase config
│   └── public/
├── backend/
│   ├── functions/         # Cloud Functions
│   ├── cloud-run/        # Cloud Run services
│   └── scripts/          # Deployment scripts
└── docs/                 # Product documentation
```

## Implementation Priorities

When implementing, follow the 4-phase roadmap:

1. **Phase 1 (Weeks 1-4)**: Core Lens Engine
   - Document upload and text extraction
   - Basic lens generation (Slide, Study, Story)
   - Simple viewer with lens switching

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

## Documentation Reference

Quick guide to project docs:

- **`docs/architecture.md`** - Technical blueprint, Firebase/GCP setup, AI pipeline
- **`docs/phase1.md`** - 4-week MVP implementation plan with code examples
- **`docs/plan.md`** - Phased roadmap from steel thread to full platform
- **`docs/product.md`** - Product vision, features, and UI concepts
- **`docs/user-stories.md`** - Feature requirements and acceptance criteria
- **`docs/components.md`** - UI component library with NYT-inspired design system