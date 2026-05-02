---
name: Event Management System
colors:
  surface: '#0e1511'
  surface-dim: '#0e1511'
  surface-bright: '#343b36'
  surface-container-lowest: '#09100c'
  surface-container-low: '#161d19'
  surface-container: '#1a211d'
  surface-container-high: '#242c27'
  surface-container-highest: '#2f3632'
  on-surface: '#dde4dd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dde4dd'
  inverse-on-surface: '#2b322d'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#0e1511'
  on-background: '#dde4dd'
  surface-variant: '#2f3632'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  stats-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  max_width: 1280px
  gutter: 24px
---

## Brand & Style

The design system is anchored in the principles of high-performance utility and functional minimalism. It is designed for power users who manage complex event logistics, requiring a workspace that minimizes cognitive load while maximizing data density and clarity.

The aesthetic is "Modern Professional"—a blend of Swiss-inspired typography, a restrained dark-mode palette, and precise structural alignment. The UI recedes to let the content lead, using subtle tonal shifts instead of heavy shadows or decorative flourishes to define hierarchy. The emotional response is one of reliability, technical sophistication, and calm control.

## Implementation Notes

The project uses **Geist Sans** (instead of Inter from the spec) for all text — Geist is a close relative of Inter with slightly tighter metrics, better suited for dense data UIs. All color values from the spec are mapped to the existing Tailwind/shadcn zinc + emerald dark theme already configured in `globals.css`.

## Colors

The palette utilizes a deep zinc scale to create a sense of depth without relying on traditional elevation. The foundation is a "True Black" background, with surfaces stepping up in lightness to define containment.

Emerald-500 serves as the singular "action" color, reserved for primary calls-to-action and active indicators. This high-contrast pairing against the zinc background ensures that user focus is immediately drawn to the most critical interactive elements. Muted text and borders use lower-contrast zinc shades to ensure that secondary information does not compete with primary data points.

### Mapped tokens (globals.css)

| Design token        | CSS variable         | Value (oklch)             |
| ------------------- | -------------------- | ------------------------- |
| background          | `--background`       | `oklch(0.145 0.01 160)`   |
| surface (cards)     | `--card`             | `oklch(0.175 0.008 160)`  |
| border              | `--border`           | `oklch(0.28 0.01 160)`    |
| primary (emerald)   | `--primary`          | `oklch(0.78 0.16 162.48)` |
| muted text          | `--muted-foreground` | `oklch(0.52 0.015 160)`   |
| error / destructive | `--destructive`      | rose-500 equivalent       |

## Typography

This design system uses Geist Sans for all applications to maintain a systematic, utilitarian appearance. Hierarchy is established through weight and tracking rather than drastic size changes.

Headings feature semibold weights with slightly tightened letter-spacing. For data-heavy views, stats and numeric values **must** use `tabular-nums` to ensure vertical alignment across tables and dashboards. Body copy is kept at 14px.

## Layout & Spacing

The layout follows a fixed-grid approach for primary dashboard content, centered within a 1280px maximum width container.

Internal spacing follows a strict 8px rhythm (16/24/32). Sections within the dashboard are separated by 32px, elements within a card use 16px or 24px padding.

## Elevation & Depth

Depth is communicated through **Tonal Layering** — no drop shadows:

| Level | Token       | Usage                         |
| ----- | ----------- | ----------------------------- |
| 0     | background  | App canvas                    |
| 1     | surface-low | Layout containers, sidebar    |
| 2     | card        | Metric cards, chart modules   |
| hover | muted/60    | Row hovers, interactive items |

## Shapes

Default border radius for controls: 8px (`rounded-lg`).
Larger containers and cards: 12px (`rounded-xl`).
Icon stroke weight: 1.5px.

## Components

### Buttons

- **Primary:** `bg-primary text-primary-foreground`, 8px radius, no shadow.
- **Secondary:** `bg-transparent border border-border`, hover `bg-muted/60`.
- **Ghost:** No border, hover `bg-muted/60`.

### Inputs & Fields

- Background `bg-background`, border `border-border`, focus `ring-primary`.
- Label: 12px, semibold, `text-muted-foreground`.

### Data Displays

- **Status chips:** Pill-shaped, 10% opacity background + solid dot. Active=emerald, closed=zinc, cancelled=rose.
- **Data tables:** Borderless rows with 1px bottom divider. Header cells in all-caps label style, `text-muted-foreground`.
- **Metric cards:** Colored top-border accent by variant (success/warning/error). Value in `tabular-nums` at 2xl–3xl weight semibold.

### Charts

- Color palette: emerald (`#10b981`) for success/entries, rose (`#f43f5e`) for errors.
- Grid lines: `border-border/30`, very subtle.
- Axis text: `text-muted-foreground`, 12px.
- Tooltips: `bg-card border border-border` with standard card styling.

### Navigation

- **Sidebar:** 240px fixed, `bg-background`. Active links: subtle `bg-emerald-500/8` + 2px emerald left-edge indicator.
- **Breadcrumb:** Zinc-500 inactive, zinc-200 active page, 12px, chevron separator.
