# Web Migration Notes

This package is extracted from the `web` repo's visual language, not from its runtime architecture.

## What Moved Cleanly

- Color tokens from `web/app/globals.css`
- Typography defaults and text treatments
- Focus and selection behavior
- Brand motion utilities like the CTA glow and blink/pulse animations
- Surface, card, button, hero, shell, and stack primitives
- optional Tailwind token mapping compatible with `web`'s Tailwind-first workflow

## What Stayed Behind

- Next.js routing and image components
- Radix React wrappers
- Framer Motion behaviors
- Component-local Tailwind compositions

## Mapping Guidance

Use this package when the original `web` component mainly contributed styling.

- `web` `cta-glow` -> `ml-button-glow`
- `web` gray-to-white text links and arrow nudges -> `ml-link-neutral`, `ml-link-arrow`
- `web` accent text links -> `ml-link-accent`
- `web` section shell patterns -> `ml-section`, `ml-shell`, `ml-section-border`
- `web` heading and eyebrow treatments -> `ml-heading-display`, `ml-heading-section`, `ml-eyebrow`
- `web` card shells -> `ml-surface-card`, `ml-card`, `ml-card-dark`, `ml-card-light`
- `web` hoverable marketing cards -> `ml-surface-interactive`, `ml-surface-dark-subtle`, `ml-surface-light-subtle`, `ml-card-hover-title`
- `web` pricing-card list density -> `ml-pricing-list-web`
- `web` text color patterns -> `ml-text-body`, `ml-text-muted`

When the original component mixed styling with runtime behavior, rebuild the behavior inside the target framework and keep the look aligned with these classes and tokens.
