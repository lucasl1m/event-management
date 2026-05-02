---
name: Event Management System
colors:
  surface: '#16110f'
  surface-container: '#211917'
  on-surface: '#f2e9e4'
  on-surface-variant: '#cfbeb5'
  outline: '#948179'
  primary: '#ff7437'
  on-primary: '#2e1207'
  primary-container: '#ff9a6b'
  on-primary-container: '#2e1207'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  background: '#16110f'
  on-background: '#f2e9e4'
  surface-variant: '#362b27'
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

The project uses **Geist Sans** (instead of Inter from the spec) for all text — Geist is a close relative of Inter with slightly tighter metrics, better suited for dense data UIs. All color values from the spec are mapped to the existing Tailwind/shadcn warm dark + orange accent theme configured in `globals.css`. **Theme:** default **dark**, with user-selectable **light**, **dark**, or **system** via `next-themes` (`:root` = light, `.dark` = dark); charts use CSS variables (`--chart-grid`, `--chart-cursor`, `--muted-foreground`) so axes and grids stay legible in both modes.

## Colors

The palette uses a warm dark scale to create depth without relying on traditional elevation. The foundation remains very dark, with surfaces stepping up in lightness to define containment.

The brand orange (`#ff7437`) is the singular "action" color, reserved for primary calls-to-action and active indicators. This high-contrast pairing against the warm dark background ensures that user focus is immediately drawn to the most critical interactive elements. Muted text and borders use lower-contrast warm neutrals so secondary information does not compete with primary data points.

### Mapped tokens (globals.css)

| Design token        | CSS variable         | Value (oklch)           |
| ------------------- | -------------------- | ----------------------- |
| background          | `--background`       | `oklch(0.145 0.008 35)` |
| surface (cards)     | `--card`             | `oklch(0.205 0.009 35)` |
| border              | `--border`           | `oklch(1 0 0 / 8%)`     |
| primary (orange)    | `--primary`          | `#ff7437`               |
| muted text          | `--muted-foreground` | `oklch(0.72 0.008 35)`  |
| error / destructive | `--destructive`      | rose-500 equivalent     |

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

- **Status chips:** Pill-shaped, 10% opacity background + solid dot. Active=orange, closed=neutral, cancelled=rose.
- **Data tables:** Borderless rows with 1px bottom divider. Header cells in all-caps label style, `text-muted-foreground`.
- **Metric cards:** Colored top-border accent by variant (success/warning/error). Value in `tabular-nums` at 2xl–3xl weight semibold.

### Charts

- Color palette: orange (`#ff7437`) for success/entries, rose (`#f43f5e`) for errors.
- Grid lines: `border-border/30`, very subtle.
- Axis text: `text-muted-foreground`, 12px.
- Tooltips: `bg-card border border-border` with standard card styling.

### Navigation

- **Sidebar:** 240px fixed, `bg-background`. Active links: subtle `bg-primary/10` + 2px `primary` left-edge indicator.
- **Breadcrumb:** Zinc-500 inactive, zinc-200 active page, 12px, chevron separator.
