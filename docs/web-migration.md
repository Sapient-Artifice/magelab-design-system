# Web Migration Notes

This package is extracted from the `web` repo's visual language, not from its runtime architecture.

## What Moved Cleanly

- Color tokens from `web/app/globals.css`
- Typography defaults and text treatments
- Focus and selection behavior
- Brand motion utilities like the CTA glow and blink/pulse animations
- Surface, card, button, hero, shell, and stack primitives

## What Stayed Behind

- Next.js routing and image components
- Radix React wrappers
- Framer Motion behaviors
- Component-local Tailwind compositions

## Mapping Guidance

Use this package when the original `web` component mainly contributed styling.

- `web` `cta-glow` -> `ml-button-glow`
- `web` section shell patterns -> `ml-section`, `ml-shell`, `ml-section-border`
- `web` heading and eyebrow treatments -> `ml-heading-display`, `ml-heading-section`, `ml-eyebrow`
- `web` card shells -> `ml-surface-card`, `ml-card`, `ml-card-dark`, `ml-card-light`
- `web` text color patterns -> `ml-text-body`, `ml-text-muted`

When the original component mixed styling with runtime behavior, rebuild the behavior inside the target framework and keep the look aligned with these classes and tokens.
