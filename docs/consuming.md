# Consuming The Package

The package exports plain CSS so each framework can keep its own component model.

## Next.js

Import the bundle from a global stylesheet:

```css
@import "@magelab/design-system";
```

Then build React components against the shared classes:

```tsx
export function Hero() {
  return (
    <section className="ml-hero ml-spotlight">
      <div className="ml-hero-content ml-stack-md">
        <p className="ml-eyebrow">AI Infrastructure You Actually Own</p>
        <h1 className="ml-heading-display">AI infrastructure you actually own.</h1>
        <p className="ml-text-body">One platform for AI orchestration. You choose where it runs.</p>
        <div className="ml-action-row">
          <a className="ml-button ml-button-primary ml-button-glow" href="/download">Download Mage</a>
          <a className="ml-button ml-button-secondary" href="/gateway">Try the Gateway</a>
        </div>
      </div>
    </section>
  );
}
```

## SvelteKit

Import the same CSS in `app.css`:

```css
@import "@magelab/design-system";
```

Then consume it from Svelte markup:

```svelte
<section class="ml-hero ml-spotlight">
  <div class="ml-hero-content ml-stack-md">
    <p class="ml-eyebrow">AI Infrastructure You Actually Own</p>
    <h1 class="ml-heading-display">AI infrastructure you actually own.</h1>
    <p class="ml-text-body">One platform for AI orchestration. You choose where it runs.</p>
    <div class="ml-action-row">
      <a class="ml-button ml-button-primary ml-button-glow" href="/download">Download Mage</a>
      <a class="ml-button ml-button-secondary" href="/gateway">Try the Gateway</a>
    </div>
  </div>
</section>
```

## Custom Adapters

If a framework needs richer components, keep them as local adapters around:

- shared tokens
- shared utility classes
- shared accessibility and motion rules

Do not try to force shared runtime component code across incompatible frameworks.
