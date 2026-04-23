# Reference

## Token Categories

- Typography: font families, sizes, line heights, and letter spacing
- Color: core brand palette, semantic surfaces, borders, overlay, and status colors
- Radius: small through 3xl corner tokens
- Space: rhythm tokens from `1` to `32`
- Layout: container widths and border widths
- Shadow: small through xl depth tokens
- Motion: durations and easing semantics
- Z-index: base, sticky, dropdown, overlay, and modal layers

## Token Pipeline

- Canonical source: `tokens/tokens.source.json`
- Generated CSS variables: `src/tokens.css`
- Generated JSON export: `src/tokens.json`

The generated assets should not be hand-edited.

## Themes

- Default theme: `dark`
- Alternate theme: `light`

Theme switching is token-based, not class-based. Apply a `data-theme` attribute to any container and the existing recipe classes continue to work.

## Pattern Categories

- Shells and layout: `ml-shell`, `ml-shell-md`, `ml-section`, `ml-section-lg`, `ml-grid-2`, `ml-grid-3`
- Typography: `ml-eyebrow`, `ml-heading-display`, `ml-heading-section`, `ml-heading-card`, `ml-text-body`, `ml-text-muted`
- Buttons and surfaces: `ml-button*`, `ml-surface-card`, `ml-surface-panel`, `ml-surface-soft`, `ml-surface-dark-subtle`, `ml-surface-light-subtle`, `ml-card*`
- Interactive affordances: `ml-surface-interactive`, `ml-link-accent`, `ml-link-neutral`, `ml-link-arrow`, `ml-card-hover-title`
- Navigation: `ml-nav`, `ml-nav-shell`, `ml-nav-brand`, `ml-nav-links`, `ml-nav-link`
- Features and pricing: `ml-feature-grid`, `ml-feature-card`, `ml-feature-list`, `ml-pricing-grid`, `ml-pricing-card`, `ml-pricing-list-web`, `ml-price*`
- Forms: `ml-form-field`, `ml-form-row`, `ml-label`, `ml-input`, `ml-textarea`, `ml-field-hint`, `ml-field-error`, `ml-kbd`
- Feedback: `ml-callout*`, `ml-badge`, `ml-icon-chip`
- Overlays: `ml-dialog-backdrop`, `ml-dialog-panel`, `ml-sheet-panel`

## Optional Assets And Effects

- Assets: favicon/app icons, manifest metadata, and `assets/brand-mark.svg`
- Effect styles: `src/effects.css`
- Effect modules: `effects/index.js`, `effects/floating-shapes.js`, `effects/pointer-tracer.js`

These are optional enhancements. They should be imported intentionally rather than treated as part of the minimum design-system contract.

## Design Contract

This package defines:

- the token vocabulary
- the visual grammar for common Magelab UI patterns
- the layout and density defaults

This package does not define:

- framework runtime components
- state management
- animation orchestration beyond CSS utilities
- accessibility logic for complex widgets

Complex interactive UI should be implemented per framework against this shared contract.
