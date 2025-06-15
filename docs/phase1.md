# Phase 1: Core Lens Engine Implementation Plan
**Duration**: 4 weeks  
**Goal**: Working application where users can log in, upload documents, and edit them with basic lens switching

## Design System Requirements

### Typography (New York Times inspired)
- **Primary Font**: Georgia, Times New Roman (serif for body text)
- **Secondary Font**: -apple-system, BlinkMacSystemFont (sans-serif for UI)
- **Scale**: 14px base, 1.25 ratio (14, 18, 22, 28, 35, 44px)
- **Line Height**: 1.6 for body text, 1.2 for headings

### Visual Design (Linear.app + Craft.do inspired)
- **Colors**:
  - Background: #FAFAFA (warm white)
  - Surface: #FFFFFF 
  - Primary: #FF6B35 (orange accent)
  - Text: #1A1A1A (near black)
  - Muted: #6B7280 (gray)
  - Border: #E5E7EB (light gray)
- **Spacing**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)
- **Shadows**: Subtle, warm shadows with slight orange tint
- **Borders**: 1px solid, rounded corners (4px small, 8px medium, 12px large)

## Week 1: Project Foundation & Authentication

### Day 1-2: Project Setup
**Frontend Setup**
```bash
# Initialize React app with Vite
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Install core dependencies
npm install @milkdown/core @milkdown/react @milkdown/preset-commonmark
npm install @milkdown/theme-nord @milkdown/plugin-listener
npm install firebase zustand react-router-dom
npm install tailwindcss @tailwindcss/typography
npm install framer-motion @headlessui/react
npm install lucide-react react-dropzone
```

**Project Structure**
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Base UI components
│   │   ├── auth/         # Authentication components
│   │   ├── editor/       # Milkdown editor components
│   │   ├── upload/       # File upload components
│   │   └── layout/       # Layout components
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Editor.tsx
│   │   └── Auth.tsx
│   ├── store/
│   │   ├── auth.ts       # Authentication store
│   │   ├── documents.ts  # Document management store
│   │   └── editor.ts     # Editor state store
│   ├── lib/
│   │   ├── firebase.ts   # Firebase configuration
│   │   ├── types.ts      # TypeScript definitions
│   │   └── utils.ts      # Utility functions
│   └── styles/
│       ├── globals.css   # Global styles and design tokens
│       └── editor.css    # Milkdown customizations
```

**Design System Implementation**
```css
/* globals.css - Design tokens */
:root {
  /* Typography */
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Colors */
  --bg-primary: #FAFAFA;
  --bg-surface: #FFFFFF;
  --color-primary: #FF6B35;
  --color-text: #1A1A1A;
  --color-muted: #6B7280;
  --color-border: #E5E7EB;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(255, 107, 53, 0.1);
  --shadow-md: 0 4px 12px rgba(255, 107, 53, 0.15);
  --shadow-lg: 0 8px 24px rgba(255, 107, 53, 0.2);
}
```

### Day 3-4: Firebase Setup & Authentication
**Backend Setup**
```bash
# Initialize Firebase project
firebase init

# Select features:
# - Authentication
# - Firestore
# - Storage
# - Functions
# - Hosting
```

**Firestore Security Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /documents/{documentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /lenses/{lensId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}
```

**Authentication Components**
- Login/Register forms with email/password
- Google Sign-In integration
- Protected route wrapper
- User profile management

### Day 5-7: Core UI Components

**Base Components**
```typescript
// Button.tsx - Linear.app inspired
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Input.tsx - Clean, minimal inputs
interface InputProps {
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
}

// Card.tsx - Document cards with subtle shadows
interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
}
```

**Layout Components**
- Sidebar navigation (matching HomePage.png)
- Top navigation bar
- Main content area
- Responsive grid system

## Week 2: Document Upload & Storage

### Day 8-10: File Upload System

**Upload Component**
```typescript
// UploadZone.tsx
interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  acceptedTypes: string[];
  maxSize: number;
}
```

**Features**:
- Drag & drop interface (matching HomePage.png design)
- File type validation (PDF, DOCX, TXT, MD)
- Size limits (10MB max)
- Upload progress tracking
- Error handling with user-friendly messages

**Cloud Storage Integration**
```typescript
// uploadDocument.ts
export const uploadDocument = async (
  file: File,
  userId: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, `documents/${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      reject,
      () => resolve(uploadTask.snapshot.ref.fullPath)
    );
  });
};
```

### Day 11-14: Text Extraction Pipeline

**Cloud Function Setup**
```typescript
// functions/src/extractText.ts
export const extractText = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucket = admin.storage().bucket();
  const file = bucket.file(filePath);
  
  // Download file
  const [fileBuffer] = await file.download();
  
  // Extract text based on file type
  let extractedText: string;
  if (filePath.endsWith('.pdf')) {
    extractedText = await extractPDFText(fileBuffer);
  } else if (filePath.endsWith('.docx')) {
    extractedText = await extractDOCXText(fileBuffer);
  } else {
    extractedText = fileBuffer.toString('utf-8');
  }
  
  // Store in Firestore
  await db.collection('documents').add({
    userId: getUserIdFromPath(filePath),
    fileName: path.basename(filePath),
    extractedText,
    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'extracted'
  });
});
```

**Text Extraction Libraries**
```bash
npm install pdf-parse mammoth marked
```

## Week 3: Milkdown Editor Integration

### Day 15-17: Editor Setup

**Milkdown Configuration**
```typescript
// EditorComponent.tsx
import { Editor, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { ReactEditor, useEditor } from '@milkdown/react';

export const DocumentEditor: React.FC<{ content: string }> = ({ content }) => {
  const { editor } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark)
      .use(customTheme) // NYT typography theme
  );

  return <ReactEditor editor={editor} />;
};
```

**Custom Theme (NYT Typography)**
```css
/* editor.css */
.milkdown {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-text);
  max-width: 680px; /* NYT article width */
  margin: 0 auto;
  padding: var(--space-8);
}

.milkdown h1 {
  font-size: 44px;
  font-weight: 700;
  line-height: 1.2;
  margin: var(--space-16) 0 var(--space-6) 0;
  color: var(--color-text);
}

.milkdown h2 {
  font-size: 35px;
  font-weight: 600;
  line-height: 1.2;
  margin: var(--space-12) 0 var(--space-4) 0;
}

.milkdown p {
  margin: var(--space-4) 0;
  font-size: 18px;
  line-height: 1.6;
}

.milkdown blockquote {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--space-4);
  margin: var(--space-6) 0;
  font-style: italic;
  color: var(--color-muted);
}
```

### Day 18-21: Document Management

**Document Store**
```typescript
// store/documents.ts
interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  error: string | null;
}

interface Document {
  id: string;
  title: string;
  content: string;
  extractedText: string;
  lenses: Lens[];
  createdAt: Date;
  updatedAt: Date;
}

interface Lens {
  id: string;
  type: 'slide' | 'study' | 'story';
  content: string;
  generatedAt: Date;
}
```

**Document Grid (matching HomePage.png)**
- Recent documents display
- Document thumbnails/previews
- Search and filter functionality
- "New Doc" and "Templates" buttons

## Week 4: Basic Lens Generation & Polish

### Day 22-24: Gemini API Integration

**Lens Generation Service**
```typescript
// lib/lensGeneration.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateLens = async (
  text: string,
  lensType: 'slide' | 'study' | 'story'
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompts = {
    slide: `Transform this text into 5-7 key presentation slides with bullet points:`,
    study: `Create detailed study notes with examples and explanations:`,
    story: `Rewrite this as an engaging narrative story:`
  };
  
  const result = await model.generateContent(
    `${prompts[lensType]}\n\n${text}`
  );
  
  return result.response.text();
};
```

**Cloud Function for Lens Generation**
```typescript
// functions/src/generateLenses.ts
export const generateLenses = functions.firestore
  .document('documents/{documentId}')
  .onCreate(async (snap, context) => {
    const document = snap.data();
    const documentId = context.params.documentId;
    
    // Generate all three lenses in parallel
    const lensPromises = ['slide', 'study', 'story'].map(async (type) => {
      const content = await generateLens(document.extractedText, type);
      return {
        type,
        content,
        generatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
    });
    
    const lenses = await Promise.all(lensPromises);
    
    // Store lenses in subcollection
    const batch = db.batch();
    lenses.forEach((lens) => {
      const lensRef = db.collection('documents').doc(documentId)
        .collection('lenses').doc(lens.type);
      batch.set(lensRef, lens);
    });
    
    await batch.commit();
  });
```

### Day 25-26: Lens Switching UI

**Lens Selector (matching MainContent.png)**
```typescript
// LensSelector.tsx
interface LensSelectorProps {
  currentLens: string;
  onLensChange: (lens: string) => void;
  availableLenses: Lens[];
}

const LensSelector: React.FC<LensSelectorProps> = ({
  currentLens,
  onLensChange,
  availableLenses
}) => {
  return (
    <div className="lens-panel">
      <h3>Available Document Versions</h3>
      {availableLenses.map((lens) => (
        <LensCard
          key={lens.id}
          lens={lens}
          isActive={currentLens === lens.type}
          onClick={() => onLensChange(lens.type)}
        />
      ))}
    </div>
  );
};
```

**Lens Cards Design**
- "Lecture Slides" - presentation format
- "Detailed Notes" - comprehensive study notes  
- "Economist Article" - narrative story format
- Smooth transitions with Framer Motion
- Loading states for generation

### Day 27-28: Testing & Polish

**Testing Setup**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev @types/jest jest-environment-jsdom
```

**Critical Tests**
- Authentication flow
- File upload functionality
- Text extraction pipeline
- Lens generation
- Editor integration
- Responsive design

**Performance Optimizations**
- Code splitting with React.lazy
- Image optimization
- Bundle size analysis
- Lighthouse audit (target 90+ scores)

**UI Polish**
- Loading states and skeletons
- Error boundaries
- Smooth animations
- Keyboard shortcuts
- Accessibility (WCAG 2.1 AA)

## Technical Specifications

### State Management
```typescript
// Global state structure
interface AppState {
  auth: {
    user: User | null;
    loading: boolean;
  };
  documents: {
    list: Document[];
    current: Document | null;
    uploading: boolean;
  };
  editor: {
    content: string;
    currentLens: string;
    isDirty: boolean;
  };
}
```

### API Endpoints
```typescript
// Firebase Functions
- POST /api/upload-document
- GET /api/documents
- GET /api/document/:id
- GET /api/document/:id/lenses
- POST /api/generate-lens
- PUT /api/document/:id
- DELETE /api/document/:id
```

### Database Schema
```typescript
// Firestore collections
users/{userId} {
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

documents/{documentId} {
  userId: string;
  title: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  storagePath: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

documents/{documentId}/lenses/{lensType} {
  type: 'slide' | 'study' | 'story';
  content: string;
  generatedAt: Timestamp;
  version: number;
}
```

## Deliverables Checklist

### Week 1
- [ ] Project setup with Vite + TypeScript
- [ ] Design system implementation
- [ ] Firebase configuration
- [ ] Authentication system
- [ ] Basic UI components

### Week 2  
- [ ] File upload interface
- [ ] Cloud Storage integration
- [ ] Text extraction pipeline
- [ ] Document management system

### Week 3
- [ ] Milkdown editor integration
- [ ] Custom NYT typography theme
- [ ] Document editing functionality
- [ ] Real-time saving

### Week 4
- [ ] Gemini API integration
- [ ] Basic lens generation
- [ ] Lens switching interface
- [ ] Testing and polish
- [ ] Deployment pipeline

## Success Metrics

### User Experience
- Page load time < 2 seconds
- Upload processing < 30 seconds
- Lens generation < 60 seconds
- 95%+ success rate for uploads

### Technical Quality
- TypeScript strict mode
- 90+ Lighthouse scores
- Zero console errors
- Responsive design (mobile-first)

### Business Requirements
- User registration and login
- Document upload (PDF, DOCX, TXT, MD)
- Text extraction and display
- Basic lens generation and switching
- Document editing with Milkdown

## Risk Mitigation

### Technical Risks
- **Gemini API limits**: Implement rate limiting and queuing
- **Large file processing**: Add file size limits and chunking
- **Editor performance**: Lazy load large documents
- **Firebase costs**: Monitor usage and implement caching

### UX Risks
- **Upload failures**: Clear error messages and retry logic
- **Slow lens generation**: Progress indicators and offline mode
- **Editor complexity**: Simplified toolbar and shortcuts
- **Mobile experience**: Touch-optimized interactions

This Phase 1 plan delivers a working MVP that matches the provided designs while establishing a solid foundation for future phases.