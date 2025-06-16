# Component Library - grasp.now

NYT-inspired design system with React components. Full design system details in `docs/styles.md`.

## New Document Management Components (Phase 1 Week 1)

### PromptUploadZone
```typescript
interface PromptUploadZoneProps {
  accept?: string[];
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  onPromptSubmit?: (prompt: string) => void;
  placeholder?: string;
  folderId?: string;
  validationConfig?: Partial<FileValidationConfig>;
}
```

**Features:**
- Hybrid prompt input and file upload zone
- Large input field with placeholder text
- Drag & drop file upload capability
- Real-time file validation with warnings
- Upload progress tracking
- Integrated search/AI prompt functionality
- Responsive design with hover states


### DocumentGrid
```typescript
interface DocumentGridProps {
  documents: Document[];
  viewMode: 'grid' | 'list';
  onDocumentClick: (doc: Document) => void;
  onDocumentDelete?: (doc: Document) => void;
  onDocumentEdit?: (doc: Document) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  selectedDocuments?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}
```

**Features:**
- Responsive grid (1-4 columns based on width)
- Enhanced document cards with hover effects
- Action menus (edit, delete) on hover
- Status badges (ready, processing, uploading, error)
- File size and type display
- Tag support with overflow handling
- Selection support for batch operations
- Loading skeleton cards
- Empty state with upload prompt

### DocumentManager
```typescript
interface DocumentManagerProps {
  folderId?: string;
  viewMode?: 'grid' | 'list';
  sortBy?: 'name' | 'date' | 'size';
  sortOrder?: 'asc' | 'desc';
  showUpload?: boolean;
}
```

**Features:**
- Complete document management interface
- Folder navigation with breadcrumbs
- Sort and filter controls
- Bulk selection and actions
- Integrated upload zone
- Search functionality
- Real-time updates from Firestore

### DocumentUpload
```typescript
interface DocumentUploadProps {
  folderId?: string;
  onUploadComplete?: (documents: Document[]) => void;
  maxFiles?: number;
  validationConfig?: Partial<FileValidationConfig>;
}
```

**Features:**
- Multi-file upload with progress tracking
- File validation with detailed error messages
- Preview of files before upload
- Cancel individual uploads
- Automatic retry on failure
- Firebase Storage integration

### FolderTree
```typescript
interface FolderTreeProps {
  folders: Folder[];
  selectedId?: string;
  onFolderSelect: (folderId: string) => void;
  onFolderCreate?: (parentId?: string) => void;
  onFolderRename?: (folderId: string, newName: string) => void;
  onFolderDelete?: (folderId: string) => void;
  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
}
```

**Features:**
- Hierarchical folder structure
- Expand/collapse with smooth animations
- Inline editing for folder names
- Context menu for folder actions
- Drag and drop support (planned)
- Keyboard navigation

### FolderBreadcrumb
```typescript
interface FolderBreadcrumbProps {
  folders: Folder[];
  currentFolderId?: string;
  onFolderClick: (folderId: string) => void;
  maxItems?: number;
}
```

**Features:**
- Breadcrumb navigation for folder hierarchy
- Overflow handling with ellipsis
- Click to navigate to parent folders
- Home/root folder support
- Responsive design

## File Validation Utilities

```typescript
interface FileValidationConfig {
  allowedExtensions: string[];
  maxSize: number;
  allowedMimeTypes: string[];
  maxFiles: number;
}
```

**Utilities:**
- `validateFiles(files: File[], config: FileValidationConfig)`
- `formatFileSize(bytes: number): string` 
- `getFileTypeFromExtension(filename: string): string`

## Reading Page Components (Phase 1 Week 2)

### DocumentEditor
```typescript
interface DocumentEditorProps {
  document: Document;
  selectedLens: LensType;
  lensContent: string;
  onContentChange: (content: string) => void;
}
```

**Features:**
- Integrates Milkdown for rich text editing
- Handles lens content dynamically with proper re-rendering
- Supports WYSIWYG and markdown modes
- Real-time content synchronization

### LensSelector
```typescript
interface LensSelectorProps {
  selectedLens: LensType;
  availableLenses: LensDefinition[];
  onLensSelect: (lens: LensType) => void;
}
```

**Features:**
- Dynamic lens cards with preview content
- Uses LensService for lens definitions and metadata
- Phase-based availability (locked lenses for Phase 2)
- Responsive card design with hover effects

### DocumentHeader
```typescript
interface DocumentHeaderProps {
  document: Document;
}
```

**Features:**
- Formatting toolbar for Milkdown editor
- Quick access to common text formatting
- Responsive design with overflow handling

## Services & Hooks (Phase 1 Week 2)

### LensService
**Features:**
- Centralized lens definitions and content generation
- Type-safe lens management with TypeScript
- Dynamic content templates for each lens type
- Extensible architecture for Phase 2 lens types

### useLens Hook
**Features:**
- State management for lens operations and content
- Content caching and synchronization between lenses
- Clean API for lens switching and content updates
- Integration with document store
