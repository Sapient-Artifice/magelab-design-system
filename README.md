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

Tailwind consumers can add the optional adapter layer:

- Tailwind v4: `@import "@magelab/design-system/tailwind/theme.css";`
- Tailwind v3 preset: `import preset from "@magelab/design-system/tailwind/preset";`

Build generated tokens from the canonical source:

```bash
npm run build:tokens
```

Run the visual review workflow:

```bash
npm run dev
```

Then open `/catalog/` on the local server.

Run the Tailwind adapter demo:

```bash
npm run dev:tailwind-demo
```

Then open `/tailwind-demo/` on the local server.

Build a shareable static review output:

```bash
npm run build:catalog
npm run preview
```

Run the standard validation commands:

```bash
npm test
npm run validate
```

Run the publish-readiness check:

```bash
npm run release:check
```

## Framework Notes

The package is meant to work with:

- Next.js
- SvelteKit
- Vite apps
- Static sites

Consumers should map framework components to these shared classes and tokens instead of sharing runtime component code across frameworks.

## Tailwind Adapter

Tailwind support is optional and additive.

- It does not replace the core CSS bundle.
- It maps Tailwind theme tokens onto the exported `--ml-*` variables.
- It keeps the package usable in plain CSS, Svelte, and non-Tailwind stacks.

Tailwind v4:

```css
@import "tailwindcss";
@import "@magelab/design-system";
@import "@magelab/design-system/tailwind/theme.css";
```

Tailwind v3:

```js
import preset from "@magelab/design-system/tailwind/preset";

export default {
  presets: [preset],
  content: ["./src/**/*.{js,ts,jsx,tsx,svelte}"],
};
```

## Included Recipes

- `ml-button`, `ml-button-primary`, `ml-button-secondary`, `ml-button-ghost`, `ml-button-glow`
- `ml-surface-card`, `ml-surface-panel`, `ml-surface-soft`, `ml-surface-dark-subtle`, `ml-surface-light-subtle`, `ml-card`, `ml-card-dark`, `ml-card-light`
- `ml-shell`, `ml-shell-md`, `ml-section`, `ml-section-lg`, `ml-grid-2`, `ml-grid-3`, `ml-stack-sm`, `ml-stack-md`, `ml-stack-lg`
- `ml-eyebrow`, `ml-heading-display`, `ml-heading-section`, `ml-heading-card`, `ml-text-body`, `ml-text-muted`
- `ml-hero`, `ml-hero-content`, `ml-action-row`, `ml-badge`, `ml-icon-chip`, `ml-card-hover-title`, `ml-spotlight`
- `ml-nav*`, `ml-section-header*`, `ml-feature-*`, `ml-pricing-*`, `ml-pricing-list-web`, `ml-form-*`, `ml-callout*`, `ml-dialog-*`, `ml-sheet-panel`

## Medium-Lift Scope

This repo now covers:

- richer semantic tokens for typography, layout, depth, and overlay layers
- reusable CSS recipes for common product and marketing sections
- copy-paste examples and a static visual catalog
- a token pipeline with one canonical source file and generated CSS/JSON outputs
- first themed variants with `dark` as default and `light` opt-in

This repo still does not attempt:

- framework-specific runtime component packages
- behavior-sharing for dialogs, menus, carousels, or routing
- design-tool synchronization or a multi-target token compiler beyond CSS and JSON

## Docs

- `docs/consuming.md`
- `docs/tailwind.md`
- `docs/web-migration.md`
- `docs/reference.md`
- `examples/hero.html`
- `catalog/index.html`

## Catalog Workflow

- `npm run dev` serves the repo locally for source review
- `npm run build:catalog` creates `dist/` with the catalog, docs, and generated CSS
- `npm run preview` serves `dist/` for post-build review

## Themes

The default theme is dark. Opt into the light theme by setting `data-theme="light"` on any container:

```html
<html data-theme="light">
```

or

```html
<section data-theme="light">
```

The same utility classes continue to work; only token values change.

## Assets And Effects

Brand assets are exported from:

- `assets/favicon.ico`
- `assets/favicon.png`
- `assets/favicon-32x32.png`
- `assets/favicon-16x16.png`
- `assets/favicon-96x96.png`
- `assets/apple-icon.png`
- `assets/apple-icon-180x180.png`
- `assets/icon-512.webp`
- `assets/manifest.json`
- `assets/browserconfig.xml`
- `assets/brand-mark.svg`

Optional visual effects are exported separately from the core CSS recipes:

- `@magelab/design-system/effects.css`
- `@magelab/design-system/effects`

These effects are opt-in vanilla JS modules for decorative enhancement. They are intended for catalogs, hero sections, and other brand-heavy surfaces, not as mandatory runtime behavior for every consumer.
