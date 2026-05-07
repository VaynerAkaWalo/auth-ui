---
name: barricade-style
description: Barricade's brutalist concrete design system. Use this skill when building new pages, components, or UI elements that need to match the existing auth-ui design language — heavy borders, sharp corners, monospace technical aesthetic, high-contrast inversion interactions.
---

This skill documents the **Brutalist Concrete** design system used by Barricade, an authentication UI. Follow these guidelines when creating or modifying any UI element.

## Design Philosophy

Raw, unpolished, intentionally heavy. Zero compromise on contrast. Every element has presence. Nothing is subtle. The dominant interaction pattern is **color inversion**: elements flip their background/text colors on hover.

## Theme Tokens (from `globals.css`)

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#0a0a0a` | Page background |
| `--color-surface` | `#111111` | Cards, panels, containers |
| `--color-elevated` | `#1a1a1a` | Hover states |
| `--color-foreground` | `#ffffff` | Primary text, icons |
| `--color-border` | `#2a2a2a` | Default 3px borders |
| `--color-border-strong` | `#ffffff` | Accent/hero borders |
| `--color-muted` | `#555555` | Secondary text, labels |
| `--color-destructive` | `#dc2828` | Error states |

### Typography

| Role | Font | URL |
|------|------|-----|
| Display/Headlines | `Big Shoulders Display` (800) | Google Fonts |
| Body | `DM Sans` (400, 500, 700) | Google Fonts |
| Code/Data | `JetBrains Mono` (400, 500, 700) | Google Fonts |

Always use these in `index.html` via Google Fonts link tag. Headings use `uppercase` with `letter-spacing: 0.02em`. Buttons and labels use `tracking-widest` or `tracking-[0.15em]`.

### Borders & Radius

- `--radius: 0px` — no rounded corners anywhere
- All borders are 3px thick

### Border utility classes

```css
.brutal-border         /* 3px solid white (#ffffff) */
.brutal-border-light   /* 3px solid #2a2a2a */
.brutal-border-bottom  /* 3px bottom border (#2a2a2a) */
.brutal-border-top     /* 3px top border (#2a2a2a) */
.brutal-border-left    /* 3px left border (#2a2a2a) */
.brutal-border-right   /* 3px right border (#2a2a2a) */
```

These are defined in `globals.css`. Use them instead of Tailwind's `border-*`.

## Layout Components (`src/components/layout/`)

### Header
```tsx
<Header rightContent={ReactNode} />
```
- `brutal-border-bottom`, `px-6 py-3`
- Shows "BARRICADE" wordmark in `text-3xl tracking-[0.12em]`
- `rightContent` receives navigation actions (Sign in/Register links or Logout button)

### Footer
```tsx
<Footer />
```
- `brutal-border-top`, `px-6 py-3`, centered
- Shows `BLAMEDEVS {year}` in `text-xs font-mono text-muted`

### Sidebar
```tsx
<Sidebar />
```
- 224px (`w-56`), `brutal-border-right`
- Nav items: uppercase, `tracking-wider`, `gap-4`
- Active: `bg-foreground text-background` (inverted)
- Inactive: `text-muted hover:bg-elevated hover:text-foreground`

### Layout
```tsx
<Layout headerRightContent={ReactNode} sidebar={ReactNode}>
  {children}
</Layout>
```
- Composes Header + optional Sidebar + main content + Footer
- Main content gets `p-6` when sidebar present, centered when not

## Interaction Patterns

### Color inversion (the dominant pattern)

```
// Text button
text-foreground hover:bg-foreground hover:text-background

// Filled button
bg-foreground text-background hover:bg-transparent hover:text-foreground
```

### Hover transitions
```css
transition-colors duration-150
```

### Page load reveal
```css
transition-all duration-700 ease-out
opacity-0 translate-y-12  →  opacity-100 translate-y-0
```

## Concrete Noise Texture

Applied via `body::after` in `globals.css` — a fixed SVG noise overlay at `opacity: 0.025`. Always present across all pages.

## Code Conventions

- Use the `brutal-*` utility classes for borders
- Never use `rounded-*` classes
- Prefer raw HTML elements (div, table) over shadcn wrappers when the abstraction adds nothing
- Monospace (`font-mono`) for form inputs, labels, table cells, technical data
- Uppercase + wide tracking for buttons, labels, nav items
- Color inversion for hover states
- All shadcn/ui components overridden to `rounded-none`
- Tagline/descriptive text in `text-sm font-mono text-muted`

## When Adding a New Page

1. Use shared `Header`, `Footer`, `Layout` components from `src/components/layout/`
2. Apply `brutal-border` or `brutal-border-light` to containers
3. Use `bg-surface` for card-like surfaces
4. Use color inversion for all interactive elements
5. Form labels: `text-xs tracking-[0.15em] uppercase font-mono`
6. Form inputs: `font-mono text-sm`
7. Page heading pattern:
   ```tsx
   <h2 className="text-4xl tracking-[0.1em] mb-2">Page Title</h2>
   <p className="text-sm font-mono text-muted">Subtitle</p>
   <div className="w-12 h-0.5 bg-foreground mt-4" />
   ```
