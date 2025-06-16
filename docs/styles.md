# grasp.now — Style Guide v3.1

*A fusion of **NY Times authority**, **mymind boldness**, and **Craft/Linear calm productivity***
Guiding ideas: **border‑less canvas · card emergence · generous curvature · typography as structure · purposeful motion**

---

## 1 Colour System

Minimal monochrome backbone, one professional accent, four low‑chroma pastels (tags, nav dots, muted buttons), plus dedicated "paper" token for the reading sheet.

### Light Mode

```css
/* Base surfaces */
--bg-primary:      #FFFFFF;   /* editor canvas & paper sheet */
--bg-secondary:    #FAFAFA;   /* sidebars, app chrome */
--bg-tertiary:     #F5F5F5;   /* hovers, subtle cards */
--bg-article:      #FCFCFC;   /* app background behind sheet */

/* Type */
--text-primary:    #171717;
--text-secondary:  #666666;
--text-tertiary:   #A3A3A3;

/* Borders (rare) */
--border-primary:  #EAEAEA;
--border-secondary:#D1D1D1;

/* Accent */
--accent:       #2563EB;   /* blue‑600 */
--accent-hover: #1E4FDB;

/* Semantic feedback */
--success: #16A34A;
--warning: #F97316;
--error:   #DC2626;

/* Pastel system (tags, muted buttons, nav dots) */
--pastel-red:    #FEE2E2;
--pastel-yellow: #FEF9C3;
--pastel-pink:   #FCE7F3;
--pastel-teal:   #CCFBF1;

/* Gradient hero */
--gradient-center: rgba(37,99,235,.08);
--gradient-edge:   rgba(37,99,235,0);
```

### Dark Mode

```css
--bg-primary:   #121212;
--bg-secondary: #181818;
--bg-tertiary:  #262626;
--bg-page:      #101010;

--text-primary:   #F5F5F5;
--text-secondary: #BDBDBD;
--text-tertiary:  #757575;

--border-primary:  #262626;
--border-secondary:#3D3D3D;

--accent:       #5F9BFF;
--accent-hover: #8AB4FF;

--success: #22C55E;
--warning: #FB923C;
--error:   #F87171;

--pastel-red:    #5C1E1E;
--pastel-yellow: #5C5015;
--pastel-pink:   #5C1E4A;
--pastel-teal:   #134E4A;

--gradient-center: rgba(95,155,255,.16);
--gradient-edge:   rgba(95,155,255,0);
```

---

## 2 Typography — *the structural grid*

With no borders, type scale & weight delineate hierarchy. We adopt an **augmented Major Third** scale to reach *mymind‑level* headline drama.

```css
--font-display: 'Cheltenham', Georgia, 'Times New Roman', serif;
--font-sans:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif:   'Georgia', 'Times New Roman', serif;
--font-mono:    'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Font Sizes & Mapping

```css
--text-xxs: 0.6875rem; /* 11px – UI micro */
--text-xs:  0.75rem;   /* 12px – tags, code */
--text-sm:  0.875rem;  /* 14px – captions */
--text-base:1rem;      /* 16px – app body */
--text-lg:  1.125rem;  /* 18px – doc body */
--text-xl:  1.375rem;  /* 22px – H4 */
--text-2xl: 1.75rem;   /* 28px – H3 */
--text-3xl: 2.1875rem; /* 35px – H2 */
--text-4xl: 2.75rem;   /* 44px – Section hero */
--text-5xl: 3.4375rem; /* 55px – Marketing hero */
--text-6xl: 4.2969rem; /* 69px – Splash / empty‑state */
```

Line‑height tokens

```css
--leading-tight:   1.2;
--leading-normal:  1.5;
--leading-relaxed: 1.72;
```

| Element                 | Font    | Size token | Weight | Leading token |
| ----------------------- | ------- | ---------- | ------ | ------------- |
| Navbar / UI             | Sans    | base       | 500    | normal        |
| Card title              | Sans    | lg         | 600    | tight         |
| Document H1             | Display | 3xl        | 700    | tight         |
| Marketing hero headline | Display | 5xl        | 700    | tight         |
| Empty‑state hero        | Display | 6xl        | 700    | tight         |
| Body text (Study lens)  | Sans    | lg         | 400    | normal        |
| Body text (Story lens)  | Serif   | lg         | 400    | relaxed       |

---

## 3 Spacing & Layout

4 px grid + layout helpers.

```css
--space-1: 0.25rem; /* 4 px */
--space-2: 0.5rem;  /* 8 px */
--space-3: 0.75rem; /* 12 px */
--space-4: 1rem;    /* 16 px */
--space-6: 1.5rem;  /* 24 px */
--space-8: 2rem;    /* 32 px */
--space-12:3rem;    /* 48 px */
--space-16:4rem;    /* 64 px */

--measure-article: 620px;   /* NYT column */
--width-drawer:    320px;   /* metadata */
--gap-masonry:     16px;    /* grid gap */
```

### Reading Sheet Pattern

```css
.reading-page{
  background: var(--bg-page);
  display:flex; justify-content:center;
}
.paper-sheet{
  background: var(--bg-primary);
  max-width: var(--measure-article);
  width: 100%;
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-xl);
}
```

Paper floats, everything else blends with `--bg-page`; no borders between sheet, toolbar, or chrome.

---

## 4 Shadows & Elevation

```css
--shadow-sm:   0 1px 2px rgba(0,0,0,.05);
--shadow-md:   0 2px 6px rgba(0,0,0,.06);
--shadow-lg:   0 8px 20px rgba(0,0,0,.08);
--shadow-stack:0 4px 8px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.04);
--shadow-active:0 12px 32px rgba(0,0,0,.12);
```

---

## 5 Radius Tokens

```css
--radius-sm:  6px;
--radius-md: 10px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full:9999px;
```

---

## 6 Motion & Interaction

```css
--duration-fast:   120ms;
--duration-normal: 220ms;
--ease: cubic-bezier(.4,0,.2,1);
```

Animate only `transform`, `opacity`, `color`.

### Utility classes

```css
.hover-lift:hover  { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.focus-ring:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.active-scale:active { transform: scale(.97); }
```

---

## 7 Component Recipes

### 7.1 Cards

```css
.card{
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-fast) var(--ease),
              box-shadow var(--duration-fast) var(--ease);
}
.card:hover{ transform: translateY(-2px); box-shadow: var(--shadow-active); }
```

### 7.2 Buttons

**Muted‑active design** mirrors the screenshots: selected buttons adopt pastel background, no border.

```css
.btn{
  font: 500 var(--text-sm)/1 var(--font-sans);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  transition: background var(--duration-fast) var(--ease);
}

.btn-primary{ background: var(--accent); color:#FFF; }
.btn-primary:hover{ background: var(--accent-hover); }

.btn-secondary{ background: var(--bg-tertiary); color: var(--text-primary); }
.btn-secondary:hover{ background: var(--bg-secondary); }

.btn-muted{ background: var(--pastel-teal); color: var(--text-primary); }
.btn-muted[aria-selected="true"],
.btn-toggle.is-selected{ background: var(--pastel-red); color: var(--accent); }
```

### 7.3 Tag Pill

```css
.tag-pill{
  background: var(--pastel-yellow);
  color: var(--text-primary);
  font: 500 var(--text-xs)/1 var(--font-sans);
  border-radius: var(--radius-full);
  padding: 0 var(--space-2);
  transition: transform var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
}
.tag-pill:hover{ transform: translateY(-1px); box-shadow: var(--

```

