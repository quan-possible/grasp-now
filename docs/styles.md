# Style Guide - grasp.now

## Design Philosophy

A synthesis of **NYT authority**, **Craft.do calm productivity**, and **Linear.app speed**. Monochromatic, typography-centric interface that prioritizes content through space, hierarchy, and subtle interactions.

**Key Principles:**
- **Borderless Interface**: No borders between toolbars, sidebars, and main areas - creates a seamless, contiguous workspace
- **Card Emergence**: Content cards emerge from the background with prominent shadows, like stacked papers or deck of cards
- **Enhanced Roundness**: Increased border radius throughout for a modern, approachable feel

## Color System

Intentionally minimalist monochromatic palette with a single professional accent for primary actions.

### Light Mode
```css
--bg-primary: #FFFFFF;         /* White canvas for content */
--bg-secondary: #FAFAFA;       /* Main app background, sidebars */
--bg-tertiary: #F5F5F5;        /* Hover states, subtle cards */

--text-primary: #171717;       /* Headings and strong text */
--text-secondary: #666666;     /* Body copy and labels */
--text-tertiary: #A3A3A3;      /* Disabled or hint text */

--border-primary: #EAEAEA;     /* Default borders */
--border-secondary: #D1D1D1;   /* Hovered borders */

--accent: #2563EB;             /* Professional blue */
--accent-hover: #1D4ED8;
--success: #16A34A;
--warning: #F97316;
--error: #DC2626;
```

### Dark Mode
```css
--bg-primary: #121212;         /* Pure black editor canvas */
--bg-secondary: #171717;       /* Main app background */
--bg-tertiary: #2A2A2A;        /* Hover states, cards */

--text-primary: #F5F5F5;       /* Almost white for readability */
--text-secondary: #A3A3A3;     /* Secondary info */
--text-tertiary: #666666;      /* Muted hints */

--border-primary: #2A2A2A;     /* Subtle borders on dark bg */
--border-secondary: #444444;   /* Hovered borders */

--accent: #60A5FA;             /* Lighter blue for accessibility */
--accent-hover: #93C5FD;
--success: #22C55E;
--warning: #FB923C;
--error: #F87171;
```

## Typography

Modern **sans-serif** for UI and default content (clarity/speed). Classic **serif** reserved for Story/Scholar lenses (traditional reading).

### Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif: 'Cheltenham', Georgia, 'Times New Roman', serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale (Major Third)
```css
--text-xs: 0.75rem;     /* 12px - Labels, tags */
--text-sm: 0.875rem;    /* 14px - Captions, secondary UI */
--text-base: 1rem;      /* 16px - Default body & UI */
--text-lg: 1.125rem;    /* 18px - Reading body (Story) */
--text-xl: 1.25rem;     /* 20px - Minor headings */
--text-2xl: 1.563rem;   /* 25px - Sub-sections */
--text-3xl: 1.953rem;   /* 31px - Major sections */
--text-4xl: 2.441rem;   /* 39px - Document titles */

--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.7;

--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing & Layout

Strict **4px grid system** for visual rhythm and consistency.

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

## Shadows & Elevation

Enhanced shadows to make cards emerge like stacked papers. More prominent depth for better visual hierarchy.

```css
/* Light Mode - Enhanced Paper Stack Effect */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px 0 rgba(0, 0, 0, 0.08), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
--shadow-paper-stack: 0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.04);
--shadow-card-active: 0 12px 32px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 0, 0, 0.15);

/* Dark Mode */
--shadow-dark-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
--shadow-dark-md: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
--shadow-dark-lg: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 24px 0 rgba(0, 0, 0, 0.3);
```

## Border Radius

Enhanced roundness for modern, approachable interface:

```css
--radius-sm: 6px;      /* Small elements (badges, pills) */
--radius-md: 10px;     /* Default buttons, inputs */
--radius-lg: 12px;     /* Cards and containers */
--radius-xl: 16px;     /* Large containers */
--radius-2xl: 20px;    /* Hero sections */
--radius-full: 9999px; /* Fully rounded */
```

## Animation & Interactions

Motion should be purposeful and swift. Only animate `transform`, `opacity`, and `color` for performance.

```css
--duration-fast: 150ms;
--duration-normal: 250ms;

--ease: cubic-bezier(0.4, 0, 0.2, 1);

/* Interaction States */
.hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.focus-ring:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.active-scale:active {
  transform: scale(0.98);
}
```

## Component Patterns

### Cards
```css
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease);
}

.card-stack {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-paper-stack);
  transition: all 300ms var(--ease);
}

.card-stack:hover {
  box-shadow: var(--shadow-card-active);
  transform: translateY(-2px);
}
```

**Note**: Cards no longer use borders - they emerge purely through shadow elevation.

### Buttons
```css
.btn-primary {
  background: var(--accent);
  color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-medium);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-medium);
}
```

**Note**: Secondary buttons no longer use borders, relying on background color differentiation.

## Lens-Specific Styling

CSS variables swap within the editor container based on active lens:

```css
.editor-container {
  /* Default (Study Lens) */
  --font-content: var(--font-sans);
  --text-content: var(--text-base);
  --leading-content: var(--leading-normal);
}

.editor-container.lens-story {
  --font-content: var(--font-serif);
  --text-content: var(--text-lg);
  --leading-content: var(--leading-relaxed);
}

.editor-container.lens-slide {
  /* Card-based layout with larger text */
  --text-content: var(--text-xl);
  --leading-content: var(--leading-tight);
}
```

### Usage Guidelines
- **Study**: Sans-serif, compact spacing, definition highlights
- **Story**: Serif, relaxed leading, drop caps, magazine-style
- **Slide**: Sans-serif, card layout, presentation-ready formatting

## Interface Layout Guidelines

### Borderless Design
- **No borders** between interface areas (toolbars, sidebars, main content)
- Use consistent background colors to create seamless flow
- Content separation achieved through spacing and elevation only

### Card Emergence
- Cards should "float" above the background with prominent shadows
- Use `shadow-paper-stack` for resting state, `shadow-card-active` for interaction
- Combine shadows with subtle transforms for hover states

### Enhanced Roundness
- Default cards: `rounded-xl` (16px)
- Buttons and inputs: `rounded-lg` (12px)
- Small badges/pills: `rounded-lg` (12px, not full rounds)
- Only use `rounded-full` for avatars and truly circular elements

## Implementation

1. **Tailwind Integration**: Map these tokens to `tailwind.config.js`
2. **Dark Mode**: Use `class` strategy with manual toggle
3. **Icons**: Lucide React (16px, 1.5px stroke)
4. **Performance**: Animate only `transform`, `opacity`, `color`
5. **Shadow Strategy**: Layer multiple shadows for paper-stack effect