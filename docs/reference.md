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

## Pattern Categories

- Shells and layout: `ml-shell`, `ml-shell-md`, `ml-section`, `ml-section-lg`, `ml-grid-2`, `ml-grid-3`
- Typography: `ml-eyebrow`, `ml-heading-display`, `ml-heading-section`, `ml-heading-card`, `ml-text-body`, `ml-text-muted`
- Buttons and surfaces: `ml-button*`, `ml-surface-card`, `ml-surface-panel`, `ml-card*`
- Navigation: `ml-nav`, `ml-nav-shell`, `ml-nav-brand`, `ml-nav-links`, `ml-nav-link`
- Features and pricing: `ml-feature-grid`, `ml-feature-card`, `ml-feature-list`, `ml-pricing-grid`, `ml-pricing-card`, `ml-price*`
- Forms: `ml-form-field`, `ml-form-row`, `ml-label`, `ml-input`, `ml-textarea`, `ml-field-hint`, `ml-field-error`, `ml-kbd`
- Feedback: `ml-callout*`, `ml-badge`, `ml-icon-chip`
- Overlays: `ml-dialog-backdrop`, `ml-dialog-panel`, `ml-sheet-panel`

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
