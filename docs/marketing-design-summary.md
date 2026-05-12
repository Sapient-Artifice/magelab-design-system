# Marketing Design Summary

This is a plain-language summary of the Magelab website design system for marketing, content, and creative work. The canonical implementation lives in `tokens/tokens.source.json`, with generated CSS variables in `src/tokens.css`.

## Brand Feel

Magelab uses a dark-first, technical, premium visual style. The overall look should feel precise, modern, and quietly high-end rather than playful or heavily decorative.

- Primary mood: dark, focused, intelligent, polished
- Brand accent: vivid violet used selectively for calls to action, highlights, and glow effects
- Layout style: spacious sections, centered hero content, structured grids, and compact cards
- Visual effects: subtle spotlight gradients, soft glows, thin borders, and restrained motion

## Typography

Use `Inter` as the primary website font. If Inter is unavailable, the fallback stack is `"Segoe UI", sans-serif`.

- Primary UI font: `Inter, "Segoe UI", sans-serif`
- Monospace/supporting font: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`
- Accent serif: `Georgia, "Times New Roman", serif`

Type is clean and restrained. Headings are semibold, tightly tracked, and should feel crisp rather than bulky.

- Display heading: `clamp(2.75rem, 6vw, 4rem)`, weight `600`, tight line height
- Section heading: about `2rem` to `3rem`, weight `600`
- Card heading: `1.25rem`, weight `600`
- Body text: `1rem`, relaxed line height around `1.7`
- Muted/supporting text: `0.875rem`
- Eyebrow labels: `0.75rem`, monospace, uppercase, wide letter spacing

## Core Colors

The default website theme is dark. Use the violet mage palette as the main brand color and the gray palette for backgrounds, cards, copy, and borders.

### Primary Dark Theme

| Use | Hex / Value |
| --- | --- |
| Page background | `#09090b` |
| Main text | `#fafafa` |
| Card background | `#121217` |
| Secondary surface | `#18181b` |
| Body text | `#d4d4d8` / `#e4e4e7` |
| Muted text | `#a1a1aa` |
| Primary violet | `#8b5cf6` |
| Primary hover violet | `#7c3aed` |
| Border | `rgba(255, 255, 255, 0.08)` |
| Strong border | `rgba(255, 255, 255, 0.14)` |

### Mage Violet Palette

| Token | Hex |
| --- | --- |
| Mage 50 | `#f5f3ff` |
| Mage 100 | `#ede9fe` |
| Mage 200 | `#ddd6fe` |
| Mage 300 | `#c4b5fd` |
| Mage 400 | `#a78bfa` |
| Mage 500 | `#8b5cf6` |
| Mage 600 | `#7c3aed` |
| Mage 700 | `#6d28d9` |
| Mage 800 | `#5b21b6` |
| Mage 900 | `#4c1d95` |

### Status Colors

| Use | Hex |
| --- | --- |
| Success | `#10b981` |
| Warning | `#f59e0b` |
| Error | `#ef4444` |
| Info | `#60a5fa` |

## Light Theme

Light theme exists for selected sections or pages, but the brand default is dark.

| Use | Hex / Value |
| --- | --- |
| Page background | `#fcfcfe` |
| Main text | `#14141b` |
| Card background | `#ffffff` |
| Secondary surface | `#f4f4f7` |
| Muted text | `#5b5b66` |
| Primary violet | `#6d28d9` |
| Border | `rgba(20, 20, 27, 0.12)` |

## Layout And Spacing

The system uses generous vertical section spacing with constrained content widths.

- Main page shell: max width around `80rem`
- Medium content shell: max width around `64rem`
- Small content shell: max width around `48rem`
- Standard section padding: about `6rem` vertical
- Large section padding: about `7.5rem` vertical
- Hero sections: usually at least `85vh`, centered content, spacious top and bottom padding
- Grids: two-column and three-column layouts on larger screens, stacked on small screens

## Shape, Borders, And Depth

Corners are rounded but not pill-like except for small badges.

- Standard button radius: `0.5rem`
- Card/panel radius: `0.875rem` to `1.125rem`
- Larger feature/pricing radius: `1.125rem`
- Borders are usually `1px` and low contrast
- Shadows are soft and deep on dark surfaces
- Glow effects should be violet and used sparingly
