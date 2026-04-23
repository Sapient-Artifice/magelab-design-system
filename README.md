# Magelab Design System

Framework-agnostic design tokens, CSS primitives, and portable product patterns derived from the Magelab visual language.

## Scope

This package is intentionally CSS-first.

- Design tokens live in `src/tokens.css` and `src/tokens.json`
- Base resets and accessibility defaults live in `src/base.css`
- Reusable primitive and pattern classes live in `src/utilities.css`

This package remains CSS-first. It does not try to ship one shared runtime component library across React, Svelte, and other frameworks.

## Usage

Import the full bundle:

```css
@import "@magelab/design-system";
```

Or import only the pieces you want:

```css
@import "@magelab/design-system/tokens.css";
@import "@magelab/design-system/base.css";
@import "@magelab/design-system/utilities.css";
```

## Framework Notes

The package is meant to work with:

- Next.js
- SvelteKit
- Vite apps
- Static sites

Consumers should map framework components to these shared classes and tokens instead of sharing runtime component code across frameworks.

## Included Recipes

- `ml-button`, `ml-button-primary`, `ml-button-secondary`, `ml-button-ghost`, `ml-button-glow`
- `ml-surface-card`, `ml-surface-panel`, `ml-card`, `ml-card-dark`, `ml-card-light`
- `ml-shell`, `ml-shell-md`, `ml-section`, `ml-section-lg`, `ml-grid-2`, `ml-grid-3`, `ml-stack-sm`, `ml-stack-md`, `ml-stack-lg`
- `ml-eyebrow`, `ml-heading-display`, `ml-heading-section`, `ml-heading-card`, `ml-text-body`, `ml-text-muted`
- `ml-hero`, `ml-hero-content`, `ml-action-row`, `ml-badge`, `ml-icon-chip`, `ml-spotlight`
- `ml-nav*`, `ml-section-header*`, `ml-feature-*`, `ml-pricing-*`, `ml-form-*`, `ml-callout*`, `ml-dialog-*`, `ml-sheet-panel`

## Medium-Lift Scope

This repo now covers:

- richer semantic tokens for typography, layout, depth, and overlay layers
- reusable CSS recipes for common product and marketing sections
- copy-paste examples and a static visual catalog

This repo still does not attempt:

- framework-specific runtime component packages
- behavior-sharing for dialogs, menus, carousels, or routing
- a full token build pipeline

## Docs

- `docs/consuming.md`
- `docs/web-migration.md`
- `docs/reference.md`
- `examples/hero.html`
- `catalog/index.html`
