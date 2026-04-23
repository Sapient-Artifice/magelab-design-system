# Magelab Design System

Framework-agnostic design tokens and CSS primitives extracted from the `web` repo.

## Scope

This package is intentionally CSS-first.

- Design tokens live in `src/tokens.css` and `src/tokens.json`
- Base resets and accessibility defaults live in `src/base.css`
- Reusable primitive and pattern classes live in `src/utilities.css`

This is the light-lift layer. It does not try to ship React, Next.js, or Svelte components from one shared package.

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
- `ml-shell`, `ml-section`, `ml-section-lg`, `ml-grid-2`, `ml-stack-sm`, `ml-stack-md`, `ml-stack-lg`
- `ml-eyebrow`, `ml-heading-display`, `ml-heading-section`, `ml-text-body`, `ml-text-muted`
- `ml-hero`, `ml-hero-content`, `ml-action-row`, `ml-badge`, `ml-icon-chip`, `ml-spotlight`

## Docs

- `docs/consuming.md`
- `docs/web-migration.md`
- `examples/hero.html`
