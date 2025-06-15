# Component Library - grasp.now

## Design System Foundation

### Typography
```typescript
const typography = {
  fonts: {
    heading: "'NYT-Cheltenham', 'Georgia', 'Times New Roman', serif",
    body: "'NYT-Imperial', 'Georgia', 'Times New Roman', serif", 
    ui: "'NYT-Franklin', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Monaco', 'Consolas', 'Courier New', monospace"
  },
  sizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    '4xl': '2.5rem'  // 40px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### Colors
```typescript
const colors = {
  primary: {
    black: '#000000',      // Primary text
    darkGray: '#121212',   // Headers
    mediumGray: '#333333'  // Secondary text
  },
  neutral: {
    gray900: '#1A1A1A',
    gray800: '#2D2D2D',
    gray700: '#4A4A4A',
    gray600: '#666666',
    gray500: '#888888',
    gray400: '#AAAAAA',
    gray300: '#CCCCCC',
    gray200: '#E5E5E5',
    gray100: '#F5F5F5',
    gray50: '#FAFAFA',
    white: '#FFFFFF'
  },
  semantic: {
    success: '#0F7938',
    warning: '#8B6914',
    error: '#B91C1C',
    info: '#1E40AF'
  }
}
```

### Spacing
```typescript
const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem'     // 64px
}
```

## Layout Components

### AppLayout
```typescript
interface AppLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  rightPanel?: React.ReactNode;
}
```

**Structure:**
- 240px fixed left sidebar (gray50 background)
- Top header bar (56px height, white background)
- Main content area with optional right panel
- Responsive collapse for mobile

### PageHeader
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}
```

**Features:**
- NYT-style typography for titles
- Subtle divider line below
- Right-aligned action buttons
- Breadcrumb navigation

## Core Components

### 1. Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'text';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}
```

**Styles:**
- Primary: Black background, white text
- Secondary: White background, black border
- Ghost: Transparent with gray hover
- Text: No border, underline on hover (NYT-style)

### 2. Input
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'search';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

**Features:**
- Floating label animation
- Error state with message
- Search variant with icon
- Auto-complete support

### 3. DocumentCard
```typescript
interface DocumentCardProps {
  title: string;
  preview?: string;
  space?: string;
  thumbnail?: string;
  timestamp?: Date;
  lensTypes?: string[];
  onClick?: () => void;
  selected?: boolean;
}
```

**Features:**
- Clean white card with subtle border
- Document preview text (3 lines)
- Space/folder indicator
- Small thumbnail preview
- Hover: slight shadow and border darkening
- Bottom metadata (lens types as small tags)

### 4. UploadZone
```typescript
interface UploadZoneProps {
  accept: string[];
  maxSize: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  uploading?: boolean;
  progress?: number;
}
```

**Features:**
- Large dashed border rectangle (gray300)
- Centered upload icon and instructions
- "Drag & drop your PDF file here" primary text
- "or click to browse" secondary link
- Drag state: border becomes solid black
- Upload progress bar at bottom

### 5. LensPanel
```typescript
interface LensPanelProps {
  lenses: LensOption[];
  onSelectLens: (lensId: string) => void;
  loading?: boolean;
}

interface LensOption {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  preview?: string;
}
```

**Features:**
- Right sidebar panel (320px wide)
- White cards for each lens option
- Title and brief description
- Preview area showing lens style
- Click to apply lens to document
- Loading skeleton during generation

### 6. NavigationSidebar
```typescript
interface NavigationSidebarProps {
  user: { name: string; avatar?: string };
  folders: Folder[];
  activeItem?: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
}
```

**Features:**
- Fixed 240px width, full height
- User section at top with avatar
- "Recents" and "Shared with Me" sections
- Folder tree with expand/collapse
- Active item highlighted in gray100
- "+" button for new folders
- Bottom links (Import, Help Center)

### 7. FocusSlider
```typescript
interface FocusSliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  labels?: { value: number; label: string }[];
  disabled?: boolean;
}
```

**Features:**
- Smooth dragging
- Snap points at 25%, 50%, 75%
- Visual indicators
- Keyboard control
- Touch support

### 8. Citation
```typescript
interface CitationProps {
  sourceText: string;
  pageNumber?: number;
  confidence: 'high' | 'medium' | 'low';
  onClick?: () => void;
  inline?: boolean;
}
```

**Features:**
- Hover preview of source
- Click to navigate to source
- Confidence indicator
- Inline vs block display
- Copy citation action

### 9. DocumentGrid
```typescript
interface DocumentGridProps {
  documents: Document[];
  viewMode: 'grid' | 'list';
  onDocumentClick: (doc: Document) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}
```

**Features:**
- Responsive grid (1-4 columns based on width)
- Card spacing: 16px gap
- Clean grid with no outer borders
- Loading skeleton cards
- Empty state with upload prompt

### 10. Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}
```

**Features:**
- Backdrop click to close
- ESC key support
- Focus trap
- Smooth animations
- Scrollable content

### 11. Progress
```typescript
interface ProgressProps {
  variant: 'bar' | 'circular' | 'dots';
  value?: number; // 0-100
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

**Features:**
- Multiple visual styles
- Indeterminate state
- Label support
- Color variants
- Smooth animations

### 12. Toast
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Features:**
- Auto-dismiss
- Action buttons
- Queue management
- Position options
- Swipe to dismiss

## Composite Components

### Editor (Milkdown Integration)
```typescript
interface EditorProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  lens?: string;
  plugins?: MilkdownPlugin[];
}
```

**Features:**
- NYT-style article typography
- Clean, distraction-free interface
- Slash commands for formatting
- Citation highlights in text
- Lens-specific styling
- Side toolbar on text selection

### Timeline
```typescript
interface TimelineProps {
  events: TimelineEvent[];
  orientation: 'horizontal' | 'vertical';
  onEventClick?: (event: TimelineEvent) => void;
}
```

**Features:**
- Learning journey visualization
- Interactive events
- Time-based grouping
- Expandable details
- Export capability

### LensBuilder
```typescript
interface LensBuilderProps {
  onSubmit: (prompt: string, name: string) => void;
  examples?: LensExample[];
  validating?: boolean;
}
```

**Features:**
- Natural language input
- Example templates
- Preview generation
- Prompt validation
- Save to library

## Animation Guidelines

```typescript
const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms'
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
}
```

## Accessibility Standards

- All components support keyboard navigation
- ARIA labels and roles
- Focus indicators
- Screen reader announcements
- Color contrast WCAG 2.1 AA
- Reduced motion support

## Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

## Page Layouts

### HomePage
```tsx
<AppLayout
  sidebar={<NavigationSidebar {...sidebarProps} />}
  header={<AppHeader user={user} />}
  main={
    <>
      <PageHeader title={`Good afternoon, ${user.name}`} />
      <UploadZone {...uploadProps} />
      <section>
        <SectionHeader 
          title="Recents" 
          actions={<Button variant="ghost">New Doc</Button>}
        />
        <DocumentGrid documents={recentDocs} />
      </section>
    </>
  }
/>
```

### DocumentViewPage
```tsx
<AppLayout
  sidebar={<NavigationSidebar {...sidebarProps} />}
  header={<DocumentHeader document={doc} />}
  main={<Editor content={lensContent} lens={activeLens} />}
  rightPanel={<LensPanel lenses={availableLenses} />}
/>
```

## Visual Specifications

### Shadows
```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
}
```

### Border Radius
```typescript
const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px'
}
```

## Testing Requirements

Each component must have:
- Unit tests for all props and states
- Accessibility tests (axe-core)
- Visual regression tests
- Performance benchmarks
- Storybook documentation

## Performance Guidelines

- Components lazy-loaded where appropriate
- Memoization for expensive renders
- Virtual scrolling for lists > 100 items
- Image optimization and lazy loading
- Bundle size < 200KB for component library