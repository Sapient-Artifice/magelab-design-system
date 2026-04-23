const SHAPE_TYPES = ["circle", "square", "diamond"];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function initFloatingShapes(host, options = {}) {
  if (!host || host.dataset.effectsFloatingShapes === "ready") {
    return null;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  const shapeCount = options.shapeCount ?? 9;
  const layer = document.createElement("div");
  layer.className = "ml-effects-layer ml-floating-shapes-layer";

  const shapes = Array.from({ length: shapeCount }, (_, index) => {
    const el = document.createElement("span");
    const size = randomBetween(72, 156);
    const x = randomBetween(6, 86);
    const y = randomBetween(8, 78);
    const driftX = randomBetween(-18, 18);
    const driftY = randomBetween(-14, 14);
    const rotation = randomBetween(-24, 24);
    const delay = index * 220;
    const duration = randomBetween(9000, 16000);

    el.className = "ml-floating-shape";
    el.dataset.shape = SHAPE_TYPES[index % SHAPE_TYPES.length];
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.opacity = `${randomBetween(0.16, 0.42)}`;

    layer.appendChild(el);

    return { el, driftX, driftY, rotation, delay, duration };
  });

  let rafId = 0;
  let running = true;
  const start = performance.now();

  function frame(now) {
    if (!running) {
      return;
    }

    const rect = host.getBoundingClientRect();
    const cursorX = Number(host.style.getPropertyValue("--ml-pointer-rx") || 0);
    const cursorY = Number(host.style.getPropertyValue("--ml-pointer-ry") || 0);

    for (const shape of shapes) {
      const elapsed = Math.max(0, now - start - shape.delay);
      const progress = elapsed / shape.duration;
      const wave = Math.sin(progress * Math.PI * 2);
      const sway = Math.cos(progress * Math.PI * 1.6);
      const pointerInfluence = rect.width > 0 && rect.height > 0
        ? Math.max(0, 1 - Math.hypot(cursorX - 0.5, cursorY - 0.5) * 1.5)
        : 0;
      const tx = wave * shape.driftX;
      const ty = sway * shape.driftY;
      const scale = 1 - pointerInfluence * 0.08;
      const opacity = 0.18 + ((wave + 1) / 2) * 0.22;

      shape.el.style.opacity = `${opacity}`;
      shape.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${shape.rotation + wave * 12}deg) scale(${scale})`;
    }

    rafId = window.requestAnimationFrame(frame);
  }

  host.classList.add("ml-effects-host");
  host.insertBefore(layer, host.firstChild);
  host.dataset.effectsFloatingShapes = "ready";
  rafId = window.requestAnimationFrame(frame);

  return {
    destroy() {
      running = false;
      window.cancelAnimationFrame(rafId);
      layer.remove();
      delete host.dataset.effectsFloatingShapes;
    },
  };
}
