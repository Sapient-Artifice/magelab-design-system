# Tailwind Adapter

The design system stays CSS-first. Tailwind support is an optional adapter layer.

## Why It Exists

- `web` uses Tailwind v4
- some consumers want utility access backed by the same Magelab tokens
- the core package still needs to work without Tailwind

## Tailwind v4

Import the design system bundle first, then the Tailwind adapter:

```css
@import "tailwindcss";
@import "@magelab/design-system";
@import "@magelab/design-system/tailwind/theme.css";
```

This maps Tailwind theme tokens onto the existing design-system variables, so utilities like these resolve against Magelab tokens:

- `bg-mage-600`
- `text-gray-400`
- `rounded-2xl`
- `shadow-lg`
- `font-mono`

For a lightweight local smoke test of the adapter in this repo:

```bash
npm run dev:tailwind-demo
```

Then open `/tailwind-demo/`.

## Tailwind v3

Use the preset export:

```js
import preset from "@magelab/design-system/tailwind/preset";

export default {
  presets: [preset],
  content: ["./src/**/*.{js,ts,jsx,tsx,svelte}"],
};
```

You should still import the design-system CSS so the underlying variables exist:

```css
@import "@magelab/design-system";
```

## Guidance

- Use Tailwind utilities for app-local layout and composition where helpful.
- Keep shared Magelab patterns on the exported `ml-*` classes.
- Treat the design-system tokens and CSS recipes as the source of truth, not the Tailwind adapter.
