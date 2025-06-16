# grasp.now — Unified Style Guide
A synthesis of **NY Times authority**, **mymind playfulness**, and **Craft/Linear calm productivity**.  
Principles: **borderless canvas · card emergence · enhanced roundness · typography first · purposeful motion**  

---

## 1 Colour System
Minimal monochrome foundation, one professional accent, plus four low-chroma pastels for tags, nav dots, gradients, and discovery UI.

### Light Mode
```css
/* Base */
--bg-primary:      #FFFFFF; /* editor canvas */
--bg-secondary:    #FAFAFA; /* app chrome, sidebars */
--bg-tertiary:     #F5F5F5; /* hovers, subtle cards */
--bg-article:      #FCFCFC; /* long-read backdrop */

--text-primary:    #171717;
--text-secondary:  #666666;
--text-tertiary:   #A3A3A3;

--border-primary:  #EAEAEA;
--border-secondary:#D1D1D1;

--accent:          #2563EB; /* blue 600 */
--accent-hover:    #1D4ED8;

/* Semantic feedback */
--success: #16A34A;
--warning: #F97316;
--error:   #DC2626;

/* Pastel system colours */
--tag-red:    #FEE2E2;
--tag-yellow: #FEF9C3;
--tag-pink:   #FCE7F3;
--tag-teal:   #CCFBF1;

/* Gradient hero */
--gradient-center: rgba(37,99,235,.08);
--gradient-edge:   rgba(37,99,235,0);
````

### Dark Mode

```css
--bg-primary:   #121212;
--bg-secondary: #171717;
--bg-tertiary:  #2A2A2A;
--bg-article:   #131313;

--text-primary:   #F5F5F5;
--text-secondary: #A3A3A3;
--text-tertiary:  #666666;

--border-primary:  #2A2A2A;
--border-secondary:#444444;

--accent:       #60A5FA;
--accent-hover: #93C5FD;

--success: #22C55E;
--warning: #FB923C;
--error:   #F87171;

/* Pastels shifted for contrast */
--tag-red:    #5C1E1E;
--tag-yellow: #5C5015;
--tag-pink:   #5C1E4A;
--tag-teal:   #134E4A;

--gradient-center: rgba(96,165,250,.14);
--gradient-edge:   rgba(96,165,250,0);
```

---

## 2 Typography

Display serif for dramatic headlines, workhorse sans for UI, classic serif for long-reads.

```css
--font-display: 'Cheltenham', Georgia, 'Times New Roman', serif;
--font-sans:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif:   'Georgia', 'Times New Roman', serif;
--font-mono:    'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale · Major Third

```css
--text-xs: 0.75rem;    /* 12px tags */
--text-sm: 0.875rem;   /* 14px captions */
--text-base: 1rem;     /* 16px UI */
--text-lg: 1.125rem;   /* 18px body */
--text-xl: 1.25rem;    /* 20px minor heading */
--text-2xl: 1.563rem;  /* 25px sub-section */
--text-3xl: 1.953rem;  /* 31px section */
--text-4xl: 2.441rem;  /* 39px doc title */
--text-5xl: 3.052rem;  /* 49px hero */
```

Line-height:

```css
--leading-tight:    1.25;
--leading-normal:   1.5;
--leading-relaxed:  1.7;
```

Weights: 400/500/600/700.

---

## 3 Spacing & Layout

```css
/* 4 px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Layout helpers */
--measure-article: 620px;  /* NYT reading column */
--width-drawer:    320px;  /* metadata drawer */
--gap-masonry:     16px;   /* library grid */
```

---

## 4 Shadows & Elevation

```css
/* Light */
--shadow-sm:   0 1px 2px rgba(0,0,0,.05);
--shadow-md:   0 2px 8px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.1);
--shadow-lg:   0 8px 24px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.12);
--shadow-stack:0 4px 8px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.04);
--shadow-active:0 12px 32px rgba(0,0,0,.1), 0 6px 16px rgba(0,0,0,.15);

/* Dark */
--shadow-dark-sm:   0 1px 2px rgba(0,0,0,.1);
--shadow-dark-md:   0 2px 8px rgba(0,0,0,.2);
--shadow-dark-lg:   0 0 0 1px rgba(255,255,255,.05), 0 8px 24px rgba(0,0,0,.3);
```

---

## 5 Border Radius

```css
--radius-sm:   6px;
--radius-md:  10px;
--radius-lg:  12px; /* default buttons, inputs */
--radius-xl:  16px; /* cards, containers */
--radius-2xl: 20px; /* hero */
--radius-full:9999px; /* avatars, dots */
```

---

## 6 Motion & Interaction

Optimised for 60 fps → animate only `transform`, `opacity`, `color`.

```css
--duration-fast:   150ms;
--duration-normal: 250ms;
--ease: cubic-bezier(.4,0,.2,1);
```

States:

```css
.hover-lift:hover    { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.focus-ring:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.active-scale:active { transform: scale(.98); }
```

---

## 7 Component Recipes

### 7.1 Cards

```css
.card{
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease);
}
.card-stack{
  box-shadow: var(--shadow-stack);
}
.card-stack:hover{
  box-shadow: var(--shadow-active);
  transform: translateY(-2px);
}
```

### 7.2 Buttons

```css
.btn-primary{
  background: var(--accent);
  color:#FFF;
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight:500;
}
.btn-secondary{
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight:500;
}
```

### 7.3 Gradient Hero

```css
.gradient-hero{
  background: radial-gradient(circle at center,
               var(--gradient-center) 0%,
               var(--gradient-edge)   100%);
  isolation:isolate;
}
.gradient-hero h1{
  font: 700 var(--text-5xl)/1.1 var(--font-display);
  max-width:18ch;
}
```

### 7.4 Tag-Pill

```css
.tag-pill{
  font:500 var(--text-xs)/1 var(--font-sans);
  padding:0 var(--space-2);
  border-radius:var(--radius-full);
  background:var(--tag-bg,var(--tag-red));
  color:var(--text-primary);
  transition:transform var(--duration-fast) var(--ease),
             box-shadow var(--duration-fast) var(--ease);
}
.tag-pill:hover  { transform:translateY(-1px); box-shadow:var(--shadow-sm); }
.tag-pill:active { transform:scale(.96); }
```

### 7.5 Metadata Drawer

```css
.drawer{
  width:var(--width-drawer);
  background:var(--bg-secondary);
  box-shadow:-4px 0 12px rgba(0,0,0,.06);
  transform:translateX(100%);
  opacity:0;
  transition:transform var(--duration-normal) var(--ease),
             opacity   var(--duration-normal) var(--ease);
}
.drawer.open,
@media(min-width:1440px){ .drawer.auto-desktop{ transform:translateX(0); opacity:1; } }
```

---

## 8 Lens-Specific Overrides

```css
.editor-container{ --font-content:var(--font-sans); --text-content:var(--text-base); --leading-content:var(--leading-normal); }
.editor-container.lens-story{ --font-content:var(--font-serif); --text-content:var(--text-lg); --leading-content:var(--leading-relaxed); }
.editor-container.lens-slide{ --font-content:var(--font-sans); --text-content:var(--text-xl); --leading-content:var(--leading-tight); }
```

---

## 9 Interface Layout Rules

1. **Borderless canvas** — separation via space & elevation only.
2. **Article pages** — centre `.article-wrapper` max-width `var(--measure-article)` on `--bg-article`.
3. **Library view** — Masonry grid, gap `var(--gap-masonry)`.
4. **Nav dots & tag pills** — use pastel tokens for immediate affordance, enlarge to 8 px on hover.
5. **Gradient hero** — reserve for marketing & section intros; articles stay flat white.

---

## 10 Implementation Notes

* **Tailwind**: map tokens in `tailwind.config.js` (`maxWidth.article`, `colors['tag-red']` etc.).
* **Dark-mode**: class-based; ensure pastel replacements meet WCAG AA.
* **Icons**: Lucide 16 px, 1.5 px stroke.
* **Performance**: CSS gradients only, Masonry via CSS `column` or lightweight JS.
* **Accessibility**: run contrast check, trap focus inside `.drawer`, ESC closes, reduced-motion respected.
