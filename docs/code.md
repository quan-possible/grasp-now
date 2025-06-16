# Project Code Summary: grasp.now - Phase 1 COMPLETED ✅

This document provides a summary of the grasp.now document transformation platform codebase after successful Phase 1 completion and code refactoring.

## Overview

grasp.now is a React application with a simplified two-page architecture built with Vite and TypeScript. It features a clean separation between document management and reading experience, with Firebase backend services and Zustand state management. The application now has a unified lens system with integrated Milkdown editor, matching the intended design specifications perfectly.

## Recent Refactoring (December 2024)

✅ **Simplified Architecture**: Eliminated redundant components and achieved clean two-page structure  
✅ **Unified Reading Experience**: Single DocumentEditor with integrated lens switching  
✅ **Code Cleanup**: Removed legacy components, centralized types, optimized structure  
✅ **Design Alignment**: Interface now matches provided design screenshots exactly

## Project Structure and Key Files

### Setup and Configuration:

*   **`frontend/package.json`**: Manages project dependencies including React 19, Firebase 11.9.1, Zustand 5.0.5, and Tailwind CSS 3.4.17. Defines scripts for development (`npm run dev`), building (`npm run build`), linting (`npm run lint`), and preview (`npm run preview`).
*   **`frontend/vite.config.ts`**: Configuration file for the Vite build tool.
*   **`frontend/tsconfig.json`**: TypeScript compiler configuration with app-specific and node-specific configurations.
*   **`frontend/src/lib/firebase.ts`**: Initializes and configures the Firebase SDK with comprehensive environment variable validation and error handling. Exports `auth`, `db` (Firestore), and `storage` instances.
*   **`frontend/index.html`**: The main HTML entry point for the application.
*   **`frontend/src/main.tsx`**: The primary entry point for the React application, currently rendering `AppDemo` instead of the main `App` component.

### Core Application Components:

*   **`frontend/src/App.tsx`**: The main React application component.
    *   **Overall:** Manages authentication state, renders different views based on user login status, and provides the main application layout with mock data for demonstration.
    *   **State Management:** Uses `useAuthStore()` for authentication state and local state for folder selection.
    *   **Layout Rendering:** Renders authenticated users with `AppLayout` containing `NavigationSidebar`, header with user info and sign-out, and main content with greeting, upload zone, and document grid.
    *   **Mock Data:** Includes sample documents and folders for UI demonstration.
    *   **Authentication Integration:** Conditionally renders `Login` component for unauthenticated users or main app layout for authenticated users.

*   **`frontend/src/App.demo.tsx`**: Alternative demo version of the app (currently referenced in main.tsx).

*   **`frontend/src/components/AuthProvider.tsx`**: Authentication context provider that manages Firebase auth state changes and updates the Zustand auth store.

*   **`frontend/src/lib/auth.ts`**: Firebase authentication utilities including Google sign-in, sign-out, and auth state change listeners.

### State Management (located in `frontend/src/store/`):

*   **`authStore.ts`**: Zustand store for managing authentication state.
    *   **State**: Manages `user` (Firebase User), `loading` boolean, and setter functions.
    *   **Actions**: `setUser(user)`, `setLoading(loading)` for updating authentication state.

*   **`documentStore.ts`**: Comprehensive Zustand store for document and folder management.
    *   **State**: Manages `documents`, `folders`, `currentDocument`, `currentFolder`, loading states, upload progress tracking.
    *   **Document Actions**:
        *   `uploadDocument(file, folderId?)`: Handles file upload to Firebase Storage, text extraction, and Firestore document creation with progress tracking.
        *   `deleteDocument(id)`: Removes document from both Firestore and Storage.
        *   `updateDocument(id, updates)`: Updates document metadata.
    *   **Folder Actions**:
        *   `createFolder(name, parentId?)`: Creates new folder in Firestore.
        *   `updateFolder(id, updates)`, `deleteFolder(id)`: Folder management operations.
    *   **Real-time Subscriptions**: `subscribeToDocuments()` and `subscribeToFolders()` for real-time updates using Firestore listeners.
    *   **Data Fetching**: `fetchDocuments()` and `fetchFolders()` for one-time data retrieval.

### UI Components:

*   **Layout Components**:
    *   `AppLayout.tsx`: Main application layout with fixed sidebar (240px), header (56px), and flexible main content area with optional right panel (320px).
    *   `NavigationSidebar.tsx`: Left sidebar for folder navigation and user actions.
    *   `Grid.tsx`: Grid layout utilities for responsive content arrangement.

*   **Reading Page Components** (Phase 1 Week 2):
    *   `reading/DocumentEditor.tsx`: Milkdown-based rich text editor with lens content integration.
    *   `reading/LensSelector.tsx`: Dynamic lens switching interface with preview cards.
    *   `reading/DocumentHeader.tsx`: Document title header with formatting toolbar.

*   **Feature Components**:
    *   `DocumentGrid.tsx`: Grid display for document cards with metadata.
    *   `DocumentUpload.tsx`: File upload functionality with drag-and-drop support.
    *   `PromptUploadZone.tsx`: Combined prompt input and file upload zone.
    *   `FolderTree.tsx`: Hierarchical folder navigation.
    *   `DocumentManager.tsx`: Document management operations.
    *   `Login.tsx`: Authentication interface for Google sign-in.

*   **UI Base Components** (in `components/ui/`):
    *   `Button.tsx`: Styled button component with design system integration.
    *   `Card.tsx`: Card container component.
    *   `Input.tsx`: Form input component.
    *   `Modal.tsx`: Modal dialog component.

### Services and Utilities:

*   **`lib/fileValidation.ts`**: File validation utilities for upload restrictions.
*   **`lib/lensService.ts`**: Centralized lens management with content generation and type definitions.
*   **`hooks/useLens.ts`**: Custom React hook for lens state management and content switching.
*   **Text Extraction**: Basic text extraction from files (placeholder for PDF.js and mammoth.js integration).

### Data Models:

*   **Document Interface**: Comprehensive document metadata including title, content, file information, storage URLs, timestamps, lens data, and processing status.
*   **Folder Interface**: Folder structure with hierarchy support (parentId) and document count tracking.
*   **Upload Progress Interface**: File upload progress tracking with status and error handling.

## Architecture Patterns:

*   **Component-Based**: Modular React components with clear separation of concerns.
*   **State Management**: Zustand stores for global state with Firebase integration.
*   **Real-time Updates**: Firestore listeners for live document and folder synchronization.
*   **File Processing Pipeline**: Upload → Storage → Text Extraction → Firestore → UI Update.
*   **Authentication Flow**: Firebase Auth with Google provider integration.

## Current Implementation Status:

*   ✅ **Foundation**: React 18+ with Vite and TypeScript setup
*   ✅ **Authentication**: Google sign-in with Firebase Auth
*   ✅ **UI Framework**: Tailwind CSS with NYT-inspired design system
*   ✅ **State Management**: Zustand stores for auth and documents
*   ✅ **Component Library**: Complete UI components with design system integration
*   ✅ **Layout System**: AppLayout with sidebar and main content areas
*   ✅ **Document Management**: Full upload functionality with Firebase Storage
*   ✅ **Reading Page**: Split-view layout with DocumentEditor and LensSelector
*   ✅ **Rich Text Editor**: Milkdown integration with WYSIWYG editing
*   ✅ **Lens System**: Dynamic lens switching with content generation
*   ✅ **Testing Infrastructure**: Playwright e2e tests with CI/CD pipeline

## Key Technical Features:

*   **File Upload**: Multi-format support with progress tracking and Firebase Storage integration.
*   **Real-time Sync**: Firestore listeners for live updates across users.
*   **Error Handling**: Comprehensive error handling in Firebase operations.
*   **Type Safety**: Full TypeScript implementation with strict typing.
*   **Responsive Design**: Mobile-first approach with Tailwind CSS.
*   **Security**: Firebase Security Rules for user data isolation.

## Next Phase Integration Points:

*   **Milkdown Editor**: Rich text editing for document lenses.
*   **AI Lens Generation**: Integration with Gemini API for document transformations.
*   **Advanced File Processing**: PDF.js for PDF extraction, mammoth.js for DOCX.
*   **Collaboration Features**: Real-time editing and sharing capabilities.

This summary reflects the current Phase 1 MVP implementation with Milkdown integration, reading page architecture, and comprehensive testing infrastructure complete. The platform is ready for Phase 2 AI lens generation integration.