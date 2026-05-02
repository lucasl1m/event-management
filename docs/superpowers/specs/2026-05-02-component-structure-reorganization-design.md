# Component Structure Reorganization

**Date:** 2026-05-02
**Branch:** feat/events-list (or next available branch)
**Status:** Approved

## Problem

`components/events/` mixes list and detail concerns. `components/dashboard/` holds 5 files that are exclusively used by the event detail page — the name is misleading and disconnected from the feature it serves. `status-badge.tsx` lives inside `events/` despite being used by both list and detail.

## Decision

- Introduce `components/events/details/` to house all event detail sub-components.
- Dissolve `components/dashboard/` by moving all 5 files into `events/details/`.
- Move `status-badge.tsx` to `components/shared/` since it is used across both list and detail.
- App routing (`app/(app)/events/[id]`) requires no changes — it is correct per Next.js App Router conventions.

## File Moves

| From                                               | To                                                      |
| -------------------------------------------------- | ------------------------------------------------------- |
| `components/events/event-detail-client.tsx`        | `components/events/details/event-detail-client.tsx`     |
| `components/events/event-detail-skeleton.tsx`      | `components/events/details/event-detail-skeleton.tsx`   |
| `components/dashboard/entries-over-time-chart.tsx` | `components/events/details/entries-over-time-chart.tsx` |
| `components/dashboard/metric-card.tsx`             | `components/events/details/metric-card.tsx`             |
| `components/dashboard/metrics-grid.tsx`            | `components/events/details/metrics-grid.tsx`            |
| `components/dashboard/participants-table.tsx`      | `components/events/details/participants-table.tsx`      |
| `components/dashboard/success-error-chart.tsx`     | `components/events/details/success-error-chart.tsx`     |
| `components/events/status-badge.tsx`               | `components/shared/status-badge.tsx`                    |

`components/dashboard/` is removed after all moves.

## Import Updates

All consumers of moved files must have their import paths updated:

| File                                                | Changed imports                                            |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `app/(app)/events/[id]/page.tsx`                    | `event-detail-client` path                                 |
| `app/(app)/events/[id]/loading.tsx`                 | `event-detail-skeleton` path                               |
| `components/events/details/event-detail-client.tsx` | 5 refs from `dashboard/`, 1 ref from `events/status-badge` |
| `components/events/event-card.tsx`                  | `status-badge` path                                        |

## Final Structure

```
src/components/
├── events/
│   ├── details/
│   │   ├── entries-over-time-chart.tsx
│   │   ├── event-detail-client.tsx
│   │   ├── event-detail-skeleton.tsx
│   │   ├── metric-card.tsx
│   │   ├── metrics-grid.tsx
│   │   ├── participants-table.tsx
│   │   └── success-error-chart.tsx
│   ├── event-card.tsx
│   ├── event-filters.tsx
│   ├── event-list.tsx
│   ├── event-list-skeleton.tsx
│   └── events-page-client.tsx
├── layout/
│   ├── mobile-nav.tsx
│   ├── sidebar.tsx
│   └── top-bar.tsx
├── shared/
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   ├── loading-skeleton.tsx
│   └── status-badge.tsx
└── ui/
    └── (shadcn components)
```

## Constraints

- No logic changes — this is a pure file move + import path update.
- TypeScript must pass (`pnpm typecheck`) after all moves.
- Lint must pass (`pnpm lint`) after all moves.
- No new abstractions, barrel files, or index exports introduced.
